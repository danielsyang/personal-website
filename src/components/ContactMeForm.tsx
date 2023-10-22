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
    <form onSubmit={submit}>
      <label>
        First Name
        <input type="text" id="firstName" name="firstName" required />
      </label>
      <label>
        Last Name
        <input type="text" id="lastName" name="lastName" required />
      </label>
      <label>
        Email
        <input type="email" id="email" name="email" required />
      </label>
      <label>
        Message
        <textarea id="message" name="message" required />
      </label>
      <button type="submit">Send</button>
    </form>
  );
}
