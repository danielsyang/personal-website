import type { APIRoute } from "astro";
import { contact } from "../../validations/contact";
import sgMail from "@sendgrid/mail";

const sendgridKey = import.meta.env.SENDGRID_API_KEY;
const sendgridFrom = import.meta.env.SENDGRID_FROM;
const sendgridTo = import.meta.env.SENDGRID_TO;
const recaptchaKey = import.meta.env.RECAPTCHA_SERVER_SIDE;
const action = import.meta.env.PUBLIC_CAPTCHA_ACTION;

export const prerender = false;

const recaptchaURL = "https://www.google.com/recaptcha/api/siteverify";

sgMail.setApiKey(sendgridKey);

const msg = {
  to: sendgridTo,
  from: sendgridFrom,
  subject: "Request from personal website",
};

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();

  const firstName = data.get("firstName");
  const lastName = data.get("lastName");
  const email = data.get("email");
  const message = data.get("message");
  const recaptcha = data.get("g-recaptcha-response");

  if (typeof recaptcha !== "string" || !recaptcha) {
    return new Response(
      JSON.stringify({
        message: "Recaptcha failed, try again later.",
      }),
      { status: 400 }
    );
  }

  let recaptchaResult;
  try {
    const response = await fetch(recaptchaURL, {
      method: "POST",
      body: new URLSearchParams({ secret: recaptchaKey, response: recaptcha }),
    });
    if (!response.ok) {
      throw new Error(`siteverify responded with ${response.status}`);
    }
    recaptchaResult = await response.json();
  } catch (e) {
    console.error(`couldn't verify recaptcha: ${e}`);
    return new Response(
      JSON.stringify({
        message: "Couldn't verify recaptcha, try again later.",
      }),
      { status: 502 }
    );
  }

  if (
    !recaptchaResult.success ||
    recaptchaResult.score < 0.5 ||
    recaptchaResult.action !== action
  ) {
    return new Response(
      JSON.stringify({
        message: "Recaptcha failed, try again later.",
      }),
      { status: 400 }
    );
  }

  const result = await contact.safeParseAsync({
    firstName,
    lastName,
    email,
    message,
  });

  if (result.success) {
    const info = JSON.stringify(result.data);

    try {
      await sgMail.send({
        ...msg,
        text: info,
      });
    } catch (e) {
      console.error(
        `couldn't send email from: ${email}, due to: ${JSON.stringify(e)}`
      );
      console.error(`INFO: ${info}`);

      return new Response(
        JSON.stringify({
          message: "Couldn't send message, try again later.",
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Finished.",
      }),
      { status: 200 }
    );
  } else {
    return new Response(
      JSON.stringify({
        message: "Missing required fields",
      }),
      { status: 400 }
    );
  }
};
