import { createSignal, createResource, Suspense } from "solid-js";

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
  const [response] = createResource(formData, postFormData);

  function submit(e: SubmitEvent) {
    e.preventDefault();
    setFormData(new FormData(e.target as HTMLFormElement));
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
            class="border rounded-md border-zinc-300"
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
            class="border rounded-md border-zinc-300"
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
          class="border rounded-md border-zinc-300"
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
          class="border rounded-md border-zinc-300"
          rows={8}
        />
      </div>
      <button class="mt-4 ml-auto border rounded-lg px-4 py-2" type="submit">
        Send
      </button>
    </form>
  );
}
