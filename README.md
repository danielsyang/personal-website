# danyang.ca

Personal website of Daniel Yang: about, services, work experience, projects, and a contact form.

Built with [Astro](https://astro.build) and deployed on [Vercel](https://vercel.com).

## Stack

- **Astro 7** with server output (`output: "server"`) through `@astrojs/vercel`
- **Tailwind CSS 3**, wired through PostCSS (`postcss.config.mjs`, `src/styles/global.css`)
- **SolidJS** for the interactive contact form (`client:only="solid"`)
- **astro:assets** + sharp for images: AVIF/WebP with a JPG fallback and responsive widths
- **SendGrid** sends contact form messages; **reCAPTCHA v3** protects the form; **Zod** validates it

## Getting started

Requires Node.js 24.14.1 or newer (set in `engines` in `package.json`) and pnpm. The pnpm version is pinned in `packageManager`; with Corepack enabled (`corepack enable`), the right version is used automatically.

```sh
pnpm install
pnpm dev   # http://localhost:4321
```

### Environment variables

Create a `.env` file in the project root (it is gitignored). The contact form needs these to work:

| Variable                       | Used by | Description                                        |
| :----------------------------- | :------ | :------------------------------------------------- |
| `SENDGRID_API_KEY`             | server  | SendGrid API key                                   |
| `SENDGRID_FROM`                | server  | Verified sender address                            |
| `SENDGRID_TO`                  | server  | Address that receives contact messages             |
| `RECAPTCHA_SERVER_SIDE`        | server  | reCAPTCHA v3 secret key                            |
| `PUBLIC_RECAPTCHA_CLIENT_SIDE` | client  | reCAPTCHA v3 site key                              |
| `PUBLIC_CAPTCHA_ACTION`        | both    | reCAPTCHA action name; must match on both sides    |

Set the same variables in the Vercel project settings for production.

## Commands

| Command          | Action                                                |
| :--------------- | :---------------------------------------------------- |
| `pnpm dev`       | Start the dev server at `localhost:4321`              |
| `pnpm build`     | Build to `.vercel/output/` (and `dist/`) for Vercel   |
| `pnpm astro ...` | Run Astro CLI commands, e.g. `pnpm astro --help`      |

`pnpm preview` is not supported by the Vercel adapter. To test a production build, use a Vercel preview deployment (or `vercel dev`).

## Editing content

- **Experience** and **projects** are plain arrays at the top of `src/pages/experience.astro` and `src/pages/projects.astro`. A project's `thumbnail` is optional; without one, the card shows a placeholder.
- **Page title and meta description** are passed to `Layout` as `title` and `description`. Without a `description`, a site-wide default is used.
- **Nav links** are the `links` array in `src/layouts/Layout.astro`.

## Deployment

Hosted on Vercel; there's no CI config in this repo, so deploys come from the Vercel project itself. Build output (`dist/`, `.vercel/`) is gitignored.

The contact endpoint relies on Astro's default origin check, which rejects cross-site form posts. Requests without a matching `Origin` header get a 403.
