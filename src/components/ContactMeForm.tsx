import { createSignal, createResource, createEffect, onMount } from "solid-js";

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

// Loaded in the background once the page has finished loading, so the
// ~350 KB (gzipped) reCAPTCHA script never delays the page itself.
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
    // Allow a retry on the next focus, e.g. after disabling a blocker.
    recaptchaPromise = undefined;
    throw e;
  });
  return recaptchaPromise;
}

export default function ContactMeForm() {
  const [formData, setFormData] = createSignal<FormData>();
  const [grecaptchaObj, setGrecaptchaObj] = createSignal<any>();
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

  onMount(() => {
    const schedule = () => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(preload, { timeout: 2000 });
      } else {
        setTimeout(preload, 200);
      }
    };
    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", schedule, { once: true });
    }
  });

  function preload() {
    loadRecaptcha().then(
      (g) => {
        setGrecaptchaObj(() => g);
        setScriptBlocked(false);
      },
      () => setScriptBlocked(true)
    );
  }

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    const g = grecaptchaObj();
    if (!g || preparing() || response.loading) return;

    setCaptchaFailed(false);
    setPreparing(true);
    const form = new FormData(e.target as HTMLFormElement);

    try {
      const token: string = await g.execute(CLIENT_SIDE_KEY, {
        action: ACTION,
      });
      form.append("g-recaptcha-response", token);
      setFormData(form);
    } catch {
      setCaptchaFailed(true);
    } finally {
      setPreparing(false);
    }
  }

  const label = "text-sm font-medium mb-2";
  const input =
    "bg-transparent border border-chip rounded-md px-3 py-2.5 text-[17px] focus:outline-none focus:border-ink";
  const Required = () => <span class="text-accent">*</span>;

  return (
    <form onSubmit={submit} onFocusIn={preload} class="flex flex-col gap-5">
      <div class="grid grid-cols-2 gap-5 max-[600px]:grid-cols-1">
        <div class="flex flex-col">
          <label for="firstName" class={label}>
            First name <Required />
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            autocomplete="given-name"
            required
            class={input}
          />
        </div>
        <div class="flex flex-col">
          <label for="lastName" class={label}>
            Last name <Required />
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            autocomplete="family-name"
            required
            class={input}
          />
        </div>
      </div>
      <div class="flex flex-col">
        <label for="email" class={label}>
          Email <Required />
        </label>
        <input
          type="email"
          id="email"
          name="email"
          autocomplete="email"
          required
          class={input}
        />
      </div>
      <div class="flex flex-col">
        <label for="message" class={label}>
          Message <Required />
        </label>
        <textarea
          id="message"
          name="message"
          required
          class={input}
          rows={8}
        />
      </div>
      {scriptBlocked() && (
        <p class="text-[15px] text-accent">
          The spam check couldn't load. If you use an ad or tracker blocker,
          allow google.com/recaptcha and reload the page.
        </p>
      )}
      {(response.error || captchaFailed()) && (
        <p class="text-[15px] text-accent">
          Something went wrong. Please try again, or reach me on LinkedIn.
        </p>
      )}
      {response.state === "ready" && (
        <p class="text-[15px] text-body">Thanks! Your message is on its way.</p>
      )}

      <button
        class="self-start inline-flex items-center justify-center min-w-[140px] text-lg font-medium py-[18px] px-8 border border-ink rounded-full transition-opacity hover:opacity-70 disabled:pointer-events-none disabled:opacity-50"
        type="submit"
        disabled={!grecaptchaObj() || preparing() || response.loading}
      >
        {!(preparing() || response.loading) ? (
          "Send message →"
        ) : (
          <span
            class="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
            role="status"
            aria-label="Sending"
          />
        )}
      </button>

      <button class="hidden" type="reset" ref={resetButton} />
    </form>
  );
}
