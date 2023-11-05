import { createSignal, createResource, createEffect } from "solid-js";
import { createScriptLoader } from "@solid-primitives/script-loader";

const CLIENT_SIDE_KEY = import.meta.env.PUBLIC_RECAPTCHA_CLIENT_SIDE;
const ACTION = import.meta.env.PUBLIC_CAPTCHA_ACTION;

async function postFormData(formData: FormData) {
  const response = await fetch("/api/contact", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  return data;
}

export default function ContactMeForm() {
  const [formData, setFormData] = createSignal<FormData>();
  const [grecaptchaObj, setGrecaptchaObj] = createSignal<any>();
  const [response] = createResource(formData, postFormData);
  let resetButton: HTMLButtonElement | undefined;

  createEffect(() => {
    createScriptLoader({
      src: `https://www.google.com/recaptcha/api.js?render=${CLIENT_SIDE_KEY}`,
      async onLoad() {
        // @ts-ignore
        if (grecaptcha) {
          // @ts-ignore
          setGrecaptchaObj(grecaptcha);
        }
      },
    });
  });

  createEffect(() => {
    if (response() && response().message && resetButton) {
      resetButton.click();
    }
  });

  function submit(e: SubmitEvent) {
    e.preventDefault();
    const g = grecaptchaObj();
    g.ready(() => {
      g.execute(import.meta.env.PUBLIC_RECAPTCHA_CLIENT_SIDE, {
        action: ACTION,
      }).then((token: string) => {
        const form = new FormData(e.target as HTMLFormElement);
        form.append("g-recaptcha-response", token);
        setFormData(form);
      });
    });
  }

  return (
    <form onSubmit={submit} class="flex flex-col">
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
      {response.error && (
        <p class="mt-2 text-sm text-red-500">
          Something went wrong, please try again later!
        </p>
      )}
      {response() && response().message && (
        <p class="mt-2 text-sm text-green-500">
          Your message has been sent successfully!
        </p>
      )}

      <button
        class="btn mt-2 btn-sm mx-auto md:ml-auto md:mr-0 btn-outline text-zinc-500 min-w-[62px]"
        type="submit"
        disabled={response.loading}
      >
        {!response.loading ? (
          "Send"
        ) : (
          <span class="loading loading-dots loading-xs"></span>
        )}
      </button>

      <button class="hidden" type="reset" ref={resetButton} />
    </form>
  );
}
