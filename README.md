# Norther Harier — website

Public website for Norther Harier (Uttarakhand tour packages): Next.js 16 App Router, JavaScript,
Tailwind CSS 4. All content comes from the Norther Harier API.

## Requirements

- Node.js 22.12 or newer, npm 10+
- The API running (locally on http://localhost:5000) — pages fetch their content at request time.

## Setup

```bash
npm install
cp .env.example .env.local   # then adjust if the API or site URL differ
npm run dev                  # http://localhost:3000
```

## Commands

| Command          | What it does                               |
| ---------------- | ------------------------------------------ |
| `npm run dev`    | Development server on port 3000            |
| `npm run build`  | Production build (needs the API reachable) |
| `npm start`      | Serves the production build                |
| `npm run lint`   | ESLint                                     |
| `npm run format` | Prettier                                   |

## Environment variables

| Variable                      | Example                       | Used for                                        |
| ----------------------------- | ----------------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_API_URL`         | `https://api.example.com/api` | API calls from the browser                      |
| `API_URL_INTERNAL`            | `https://api.example.com/api` | API calls from the server (optional)            |
| `NEXT_PUBLIC_SITE_URL`        | `https://www.example.com`     | Canonical links, sitemap, Open Graph            |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_live_…`                  | Razorpay checkout (public key id, never secret) |

## Deployment

Any Node.js host for Next.js (e.g. Netlify or Vercel). Set the variables above, then build and start.
API-backed pages and the sitemap render at request time, so an unavailable API does not block the build.
The API must still be healthy to serve page content, and its `CORS_ORIGINS` must include this site's origin.
Public API responses are cached for 60 seconds.

`netlify.toml` configures the build and the Render API URL. In Netlify's environment settings,
set `NEXT_PUBLIC_API_URL` and `API_URL_INTERNAL` to
`https://nh-backend-3ty2.onrender.com/api` for both builds and functions, and set
`NEXT_PUBLIC_SITE_URL` to the public website's own HTTPS URL. Redeploy after changing variables.
Never upload backend database credentials or other backend secrets to the frontend environment.

## Domain code

`src/domain/` holds this app's enums and labels, zod schemas and formatting helpers (prices, dates). The
API validates everything again on its side; keep these in step with the API when a business rule changes.

## Notes

- Images are served from Cloudinary through a custom `next/image` loader (`src/lib/imageLoader.js`).
- Read `AGENTS.md` before changing Next.js code: this major version differs from older ones.
