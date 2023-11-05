import type { APIRoute } from "astro";
import { contact } from "../../validations/contact";
import sgMail from "@sendgrid/mail";

const sendgridKey = import.meta.env.SENDGRID_API_KEY;
const sendgridFrom = import.meta.env.SENDGRID_FROM;
const sendgridTo = import.meta.env.SENDGRID_TO;
const recaptchaKey = import.meta.env.RECAPTCHA_SERVER_SIDE;
const action = import.meta.env.PUBLIC_CAPTCHA_ACTION;

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

  const response = await fetch(
    `${recaptchaURL}?secret=${recaptchaKey}&response=${recaptcha}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const recaptchaResult = await response.json();

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
