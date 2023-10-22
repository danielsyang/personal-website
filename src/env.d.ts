/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SENDGRID_API_KEY: string;
  readonly SENDGRID_FROM: string;
  readonly SENDGRID_TO: string;
}
