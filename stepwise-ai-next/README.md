# Stepwise AI

An Aurael-inspired learning-roadmap website built with Next.js App Router, React, TypeScript, Tailwind CSS v4, Framer Motion and Lucide icons. The roadmap builder sends the learner's goal, starting level, daily time and optional notes to a server-side route, which asks OpenAI to generate a personalized roadmap.

## What is included

- Responsive dark editorial landing page and Aurael-inspired styling
- Scroll-driven 3D product presentation using the supplied `ContainerScroll` component
- Interactive learning goal, level, daily-time and context inputs
- Server-side OpenAI roadmap generation at `/api/roadmap`
- Loading and error states, response validation and progress interactions
- Example environment file and ESLint configuration

## Requirements

- Node.js 20.9 or newer
- An OpenAI API key with API access and available billing/quota

## Run locally

1. Extract the ZIP and open the `stepwise-ai-next` folder in VS Code.
2. In the terminal, install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` in the project root. On Windows PowerShell:
   ```powershell
   Copy-Item .env.example .env.local
   ```
   On macOS/Linux:
   ```bash
   cp .env.example .env.local
   ```
4. Open `.env.local` and replace the placeholder with your own key:
   ```env
   OPENAI_API_KEY=your_actual_api_key
   OPENAI_MODEL=gpt-4.1-mini
   ```
   Get/manage keys at https://platform.openai.com/api-keys. API access may require separate billing. Keep this key private and never commit `.env.local` or place the key in frontend code.
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open http://localhost:3000, choose a goal and click **Build my roadmap**.

Restart the server after changing `.env.local`. `OPENAI_MODEL` is optional; the default is `gpt-4.1-mini`.

## Useful commands

```bash
npm run dev    # local development
npm run build  # production build
npm run start  # serve a production build
npm run lint   # lint the project
```

## How AI generation works

- `app/page.tsx` sends the learner's form values to `/api/roadmap` and displays the generated steps.
- `app/api/roadmap/route.ts` keeps the API key server-side, validates inputs, requests JSON from OpenAI and checks the returned roadmap before sending it to the browser.
- Without a valid key and available API quota, generation will show a setup or API error. The sample roadmap shown before the first generation is demo content and is not represented as newly generated AI output.

## Current prototype limitations

- Progress and completion state are held in browser memory and reset on refresh; there is no user account or database.
- There is no rate limiting, authentication, or production abuse protection on the AI endpoint. Add these before exposing the endpoint publicly.
- The generated plan is AI output and may need human review; resource labels are intentionally not fabricated URLs.
- This package has not been built or browser-tested in the creation environment. Run `npm install`, then `npm run build` locally and resolve any environment-specific issues before deployment.

## Project structure

- `app/page.tsx` — landing page, builder, roadmap and progress UI
- `app/api/roadmap/route.ts` — server-side OpenAI API route
- `app/globals.css` — visual styling and responsive rules
- `app/layout.tsx` — root layout and metadata
- `components/ui/container-scroll-animation.tsx` — reusable scroll animation component
