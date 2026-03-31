# Inkspire

Inkspire is a full-stack publishing platform built for the Next.js App Router assignment. It includes:

- a public content website rendered with Server Components
- a protected client-side dashboard powered by Route Handlers
- a custom Prisma data model with authentication, ownership checks, and seed data
- SEO support with dynamic metadata, canonical URLs, sitemap, robots, and OpenGraph
- analytics consent with optional Microsoft Clarity tracking

## Tech Stack

- Next.js 16 App Router
- React 19
- Prisma ORM 7
- Auth.js / NextAuth credentials login
- Mantine UI + TipTap rich text editor
- SQLite for local development
- PostgreSQL-ready mirror schema for Vercel deployment
- Vitest for unit tests

## Data Model

Main entities:

- `User`
- `Article`
- `Category`
- `Tag`
- Auth models: `Account`, `Session`, `VerificationToken`

Required relationships:

- `User -> Article` is `1:N`
- `Article <-> Tag` is `N:M`
- `Category -> Article` is `1:N`

Article fields required by the assignment:

- `title`
- `slug`
- `content`
- `createdAt`
- `updatedAt`
- `publishDate`

## Features

### Public Section

- published article list
- dynamic article detail route at `/articles/[slug]`
- search by title / excerpt / text
- category and tag filtering
- pagination
- `generateMetadata()` for article SEO
- OpenGraph metadata
- canonical URLs
- `sitemap.xml`
- `robots.txt`
- `next/image` optimization
- ISR via `revalidate = 60`

### Dashboard

- login and registration
- only authenticated users can access `/dashboard`
- users can manage only their own articles, categories, and tags
- list of own articles with pagination
- create article
- edit article
- delete article
- change status between draft and published
- rich text editor for article content
- client-side form validation with Zod + Mantine
- server-side validation in Route Handlers

### API

- `POST /api/auth/register`
- `GET /api/dashboard/articles`
- `POST /api/dashboard/articles`
- `GET /api/dashboard/articles/[id]`
- `PATCH /api/dashboard/articles/[id]`
- `DELETE /api/dashboard/articles/[id]`
- taxonomy endpoints for categories and tags
- session checks on every protected endpoint
- ownership checks on every user-owned resource

### Analytics & SEO Control

- cookie consent via `vanilla-cookieconsent`
- Microsoft Clarity loads only after explicit consent
- application remains functional when analytics are rejected
- Lighthouse report stored in [`docs/lighthouse-report.json`](./docs/lighthouse-report.json)
- Lighthouse notes stored in [`docs/lighthouse-notes.md`](./docs/lighthouse-notes.md)

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Generate Prisma client, run migrations, and seed demo data:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

4. Start the development server:

```bash
npm run dev
```

5. Open:

- public site: `http://localhost:3000`
- dashboard login: `http://localhost:3000/login`

Demo users after seeding:

- `alice@example.com` / `DemoPassword123!`
- `pavel@example.com` / `DemoPassword123!`

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm test
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run prisma:studio
```

## Environment Variables

Required for local development:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""
DISCORD_ADDITIONAL_SCOPES=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_CLARITY_ID=""
```

`NEXT_PUBLIC_CLARITY_ID` is optional. If empty, analytics remain disabled.

Discord login is optional. When enabled:

- register `http://localhost:3000/api/auth/callback/discord` as the local redirect URI in the Discord Developer Portal
- register your production callback URL in the same format, for example `https://cms.ivo.titanium.tkdev.cz/api/auth/callback/discord`
- keep `DISCORD_ADDITIONAL_SCOPES` empty for standard sign-in
- set `DISCORD_ADDITIONAL_SCOPES="connections"` only if the app will actually call Discord APIs that require the extra scope

## Deployment Notes

Local development uses `prisma/schema.prisma` with SQLite.

The repository also contains `prisma/schema.postgres.prisma`, which mirrors the same data model for Vercel deployments backed by PostgreSQL.

Suggested Vercel workflow:

1. Provision a PostgreSQL database.
2. Set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`, and optionally `NEXT_PUBLIC_CLARITY_ID` in Vercel.
3. Before the production build, generate Prisma Client from the PostgreSQL schema:

```bash
npx prisma generate --schema prisma/schema.postgres.prisma
```

4. Push the schema to PostgreSQL:

```bash
npx prisma db push --schema prisma/schema.postgres.prisma
```

5. Build and deploy the Next.js app.

Note:

- SQLite migrations are included in the repo for local evaluation.
- Final online deployment was not executed in this environment because no Vercel credentials were available.

## Search Console / Bing Checklist

After deployment:

1. Add the production URL to Google Search Console.
2. Submit `/sitemap.xml`.
3. Add the same site to Bing Webmaster Tools.
4. Submit `/sitemap.xml`.
5. Verify Clarity page-view traffic after granting consent.

## Verification

Executed locally:

- `npm run lint`
- `npm test`
- `npm run build`
- `npx prisma migrate dev --name init`
- `npx prisma db seed`

## Lighthouse

Latest local audit on `http://localhost:3001`:

- Accessibility: `1.00`
- Best Practices: `1.00`
- SEO: `1.00`

Detailed notes are stored in [`docs/lighthouse-notes.md`](./docs/lighthouse-notes.md).
