import { createSignal, createResource, createEffect } from "solid-js";

const CLIENT_SIDE_KEY = import.meta.env.PUBLIC_RECAPTCHA_CLIENT_SIDE;
const ACTION = import.meta.env.PUBLIC_CAPTCHA_ACTION;

async function postFormData(formData: FormData) {
  const response = await fetch("/api/contact", {
    method: "POST",
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message ?? `Request failed with ${response.status}`);
  }
  return data;
}

// Loaded on first interaction with the form, not on page load: the reCAPTCHA
// script is ~350 KB gzipped, far larger than the rest of the page.
let recaptchaPromise: Promise<any> | undefined;

function loadRecaptcha() {
  recaptchaPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${CLIENT_SIDE_KEY}`;
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      const g = window.grecaptcha;
      if (g) {
        g.ready(() => resolve(g));
      } else {
        reject(new Error("grecaptcha is not available"));
      }
    };
    script.onerror = () => reject(new Error("reCAPTCHA failed to load"));
    document.head.appendChild(script);
  }).catch((e) => {
    // Allow a retry on the next attempt, e.g. after disabling a blocker.
    recaptchaPromise = undefined;
    throw e;
  });
  return recaptchaPromise;
}

export default function ContactMeForm() {
  const [formData, setFormData] = createSignal<FormData>();
  const [captchaFailed, setCaptchaFailed] = createSignal(false);
  const [scriptBlocked, setScriptBlocked] = createSignal(false);
  const [preparing, setPreparing] = createSignal(false);
  const [response] = createResource(formData, postFormData);
  let resetButton: HTMLButtonElement | undefined;

  createEffect(() => {
    if (response.state === "ready" && resetButton) {
      resetButton.click();
    }
  });

  function preload() {
    loadRecaptcha().then(
      () => setScriptBlocked(false),
      () => setScriptBlocked(true)
    );
  }

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    if (preparing() || response.loading) return;

    setCaptchaFailed(false);
    setPreparing(true);
    const form = new FormData(e.target as HTMLFormElement);

    try {
      let g;
      try {
        g = await loadRecaptcha();
        setScriptBlocked(false);
      } catch {
        setScriptBlocked(true);
        return;
      }

      try {
        const token: string = await g.execute(CLIENT_SIDE_KEY, {
          action: ACTION,
        });
        form.append("g-recaptcha-response", token);
        setFormData(form);
      } catch {
        setCaptchaFailed(true);
      }
    } finally {
      setPreparing(false);
    }
  }

  return (
    <form onSubmit={submit} onFocusIn={preload} class="flex flex-col">
      <div class="md:flex gap-4">
        <div class="flex flex-col md:w-[calc(50%-8px)]">
          <label class="font-bold text-xs items-center mb-1">
            First Name <span class="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            class="border rounded-md border-zinc-300 px-2 text-xs py-1"
          />
        </div>
        <div class="flex flex-col md:w-[calc(50%-8px)] mt-4 md:mt-0">
          <label class="font-bold text-xs items-center mb-1">
            Last Name <span class="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            class="border rounded-md border-zinc-300 px-2 text-xs py-1"
          />
        </div>
      </div>
      <div class="flex flex-col mt-4">
        <label class="font-bold text-xs items-center mb-1">
          Email <span class="text-red-400">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          class="border rounded-md border-zinc-300 px-2 text-xs py-1"
        />
      </div>
      <div class="mt-4 flex flex-col">
        <label class="font-bold text-xs items-center mb-1">
          Message <span class="text-red-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          class="border rounded-md border-zinc-300 px-2 text-xs py-1"
          rows={8}
        />
      </div>
      {scriptBlocked() && (
        <p class="mt-2 text-sm text-red-500">
          The spam check couldn't load. If you use an ad or tracker blocker,
          allow google.com/recaptcha and reload the page.
        </p>
      )}
      {(response.error || captchaFailed()) && (
        <p class="mt-2 text-sm text-red-500">
          Something went wrong, please try again later!
        </p>
      )}
      {response.state === "ready" && (
        <p class="mt-2 text-sm text-green-500">
          Your message has been sent successfully!
        </p>
      )}

      <button
        class="inline-flex items-center justify-center h-8 px-3 mt-2 mx-auto md:ml-auto md:mr-0 min-w-[62px] rounded-lg border border-current text-sm font-semibold uppercase text-zinc-500 transition-colors hover:bg-zinc-700 hover:border-zinc-700 hover:text-white disabled:pointer-events-none disabled:opacity-60"
        type="submit"
        disabled={preparing() || response.loading}
      >
        {!(preparing() || response.loading) ? (
          "Send"
        ) : (
          <span
            class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            role="status"
            aria-label="Sending"
          />
        )}
      </button>

      <button class="hidden" type="reset" ref={resetButton} />
    </form>
  );
}
