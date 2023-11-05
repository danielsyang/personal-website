/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SENDGRID_API_KEY: string;
  readonly SENDGRID_FROM: string;
  readonly SENDGRID_TO: string;
  readonly PUBLIC_RECAPTCHA_CLIENT_SIDE: string;
  readonly RECAPTCHA_SERVER_SIDE: string;
  readonly PUBLIC_CAPTCHA_ACTION: string;
}
