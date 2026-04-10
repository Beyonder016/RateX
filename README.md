# RateX

RateX is a Vite + React frontend with an Express API and Prisma/PostgreSQL backend.

## Stack

- Frontend: React + Vite
- Backend: Express running from `api/index.js`
- Database: PostgreSQL via Prisma
- Recommended hosting: Vercel + managed PostgreSQL

## Environment Variables

Create a `.env` file using `.env.example`.

Required values:

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT` for local backend development

## Local Development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

## Database Commands

Generate Prisma Client:

```bash
npm run postinstall
```

Apply committed migrations:

```bash
npm run db:migrate
```

Seed sample data:

```bash
npm run db:seed
```

## Deployment Notes

This repository is prepared for Vercel deployment:

- `vercel.json` explicitly sets the framework to Vite
- the frontend output directory is `dist`
- API traffic is rewritten to `api/index.js`
- Prisma client generation runs automatically during install/build
- an initial Prisma migration is committed in `prisma/migrations`

Recommended production flow:

1. Create a managed PostgreSQL database.
2. Set `DATABASE_URL` and `JWT_SECRET` in Vercel.
3. Run `npm run db:migrate` against the production database.
4. Optionally run `npm run db:seed` once if you want demo data.
5. Deploy to Vercel.

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run db:migrate
npm run db:seed
```
