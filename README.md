# RateX

RateX is a role-based store discovery and rating platform built with React, Vite, Express, Prisma, and PostgreSQL.

The application supports three user roles:

- `ADMIN`
- `STORE_OWNER`
- `NORMAL`

Each role has a different experience:

- admins manage platform users and review high-level platform data
- store owners monitor the ratings for their assigned store
- normal users browse stores, manage wishlists, and submit ratings and reviews

This README is designed to be a detailed project guide for understanding the product, the codebase, the setup flow, and the deployment process.

## Table of Contents

1. Product Overview
2. Core Features
3. Tech Stack
4. Architecture Overview
5. Project Structure
6. Request and Data Flow
7. Role-Based Experience
8. Authentication and Authorization
9. Database Design
10. API Overview
11. Demo Data and Seeded Credentials
12. Environment Variables
13. Local Development Setup
14. Database Workflow
15. Build and Run Commands
16. Deployment on Vercel and Neon
17. Performance Notes
18. Product Rules and Current Limitations
19. Troubleshooting
20. Additional Project Notes

## Product Overview

RateX is a full-stack web application where users can discover stores, inspect ratings, and leave reviews.

The project combines:

- a React frontend for the user interface
- an Express backend for API endpoints
- Prisma for database access and modeling
- PostgreSQL as the database
- JWT-based authentication

The product is organized around role-based workflows:

- `ADMIN` sees platform management and analytics
- `STORE_OWNER` sees the performance of one store
- `NORMAL` users browse stores, maintain wishlists, and rate stores

The frontend and backend are deployed together on Vercel, while the database is intended to run on Neon PostgreSQL.

## Core Features

### Shared features

- login page for all existing accounts
- landing page after login
- protected routes based on role
- website manual page with embedded PDF
- logout support

### Admin features

- dashboard metrics
- user listing and search
- user creation
- user deletion
- store listing
- owner overview
- ratings overview

### Store owner features

- owner dashboard for one assigned store
- average rating view
- review count view
- rating distribution breakdown
- ratings table showing who rated the store

### Normal user features

- public registration
- store browsing
- store search
- store details page
- view ratings and reviews
- submit first-time ratings
- update existing ratings
- wishlist toggle
- wishlist page

## Tech Stack

### Frontend

- `React`
- `React Router`
- `Axios`
- `Vite`

### Backend

- `Express`
- `express-validator`
- `jsonwebtoken`
- `bcrypt`

### Database

- `Prisma`
- `PostgreSQL`
- `Neon` for managed hosted Postgres in production

### Deployment

- `Vercel`

### Local development tooling

- `nodemon`
- `concurrently`
- `eslint`

## Architecture Overview

### Frontend architecture

The frontend lives under `src/`.

It is structured around route-based pages:

- `Login.jsx`
- `Register.jsx`
- `LandingPage.jsx`
- `AdminDashboard.jsx`
- `OwnerDashboard.jsx`
- `NormalDashboard.jsx`
- `StoreDetails.jsx`
- `Wishlists.jsx`
- `ManualViewer.jsx`

Authentication state is managed in `src/context/AuthContext.jsx`.

The frontend API client lives in `src/api.js` and automatically adds the JWT token to outgoing requests.

### Backend architecture

The backend uses Express.

There are two important entry points:

- `api/index.js`
  Main Express app used by Vercel rewrites
- `server.js`
  Local development server startup

Business logic is split by domain:

- `backend/controllers/authController.js`
- `backend/controllers/adminController.js`
- `backend/controllers/storeController.js`
- `backend/controllers/ratingController.js`
- `backend/controllers/wishlistController.js`

Routes are grouped in:

- `backend/routes/authRoutes.js`
- `backend/routes/adminRoutes.js`
- `backend/routes/storeRoutes.js`
- `backend/routes/ratingRoutes.js`
- `backend/routes/wishlistRoutes.js`

### Database architecture

Prisma is configured in `prisma/schema.prisma`.

The database models are:

- `User`
- `Store`
- `Rating`
- `Wishlist`

The Prisma client is initialized in `backend/prisma.js`.

### Deployment architecture

The project is designed for Vercel deployment.

`vercel.json` rewrites:

- `/api/*` to the Express app entry at `api/index.js`
- all other routes to the built frontend `index.html`

In production:

1. the Vite frontend is built into `dist/`
2. Vercel serves the frontend statically
3. API requests are handled by the Express app through the rewrite layer
4. Prisma connects to PostgreSQL

## Project Structure

```text
RateX/
|- api/
|  |- index.js
|- backend/
|  |- controllers/
|  |- middlewares/
|  |- routes/
|  |- validators/
|  |- prisma.js
|- prisma/
|  |- migrations/
|  |- schema.prisma
|- public/
|  |- images and PDF manual
|- src/
|  |- assets/
|  |- components/
|  |- context/
|  |- pages/
|  |- api.js
|  |- App.jsx
|  |- main.jsx
|- .env.example
|- package.json
|- README.md
|- seed.js
|- server.js
|- vercel.json
```

### Important files

#### Frontend

- `src/App.jsx`
  Defines the route tree and role-protected navigation
- `src/context/AuthContext.jsx`
  Handles login state, token storage, decoded user state, and logout
- `src/api.js`
  Shared Axios client with auth token support

#### Backend

- `api/index.js`
  Main Express app for Vercel
- `backend/middlewares/auth.js`
  JWT verification and role restriction middleware
- `backend/validators/index.js`
  Request validation rules
- `backend/prisma.js`
  Shared Prisma client instance

#### Database and data setup

- `prisma/schema.prisma`
  Prisma schema and database model definitions
- `prisma/migrations/`
  Migration history
- `seed.js`
  Demo data seeding script

#### Deployment

- `vercel.json`
  Vercel rewrite configuration
- `server.js`
  Local server boot file

## Request and Data Flow

### Login flow

1. User submits email and password from `Login.jsx`
2. Frontend calls `POST /api/auth/login`
3. Backend checks the user in the database
4. Password is compared using `bcrypt`
5. Backend signs a JWT
6. Frontend stores the token in `localStorage`
7. `AuthContext.jsx` decodes the token payload
8. Protected routes unlock based on role

### Registration flow

1. Visitor opens `/register`
2. Frontend sends `POST /api/auth/register`
3. Backend validates request fields
4. Password is hashed
5. User is created with role `NORMAL`
6. User is redirected back to login

### Store browsing flow

1. Authenticated user opens `/stores`
2. Frontend calls `GET /api/stores`
3. Backend fetches stores from Prisma
4. Backend checks user-specific rating and wishlist state
5. Frontend renders store cards

### Rating flow

1. Normal user opens a store page
2. Frontend loads `GET /api/stores/:id`
3. User opens the rating modal
4. Frontend sends:
   - `POST /api/ratings` for a first rating
   - `PUT /api/ratings/:id` for updates
5. Backend stores the rating and recalculates `averageRating`

### Wishlist flow

1. Normal user clicks the heart icon
2. Frontend sends `POST /api/wishlists/toggle`
3. Backend creates or removes a wishlist record
4. UI refreshes to show the new state

## Role-Based Experience

### `ADMIN`

Admins can:

- log in using seeded or admin-created credentials
- access `/admin`
- view platform totals
- create users
- remove users
- search users and stores
- inspect owners and rating overview

Admins can browse stores, but they cannot submit ratings because rating endpoints are restricted to `NORMAL` users.

### `STORE_OWNER`

Store owners can:

- log in
- access `/owner`
- see their assigned store summary
- view total reviews
- inspect average rating
- inspect rating distribution
- inspect users who rated their store

If an owner account has no store assigned, the owner sees a `No Store Found` state.

### `NORMAL`

Normal users can:

- register publicly
- log in
- browse stores
- search stores
- open store details
- manage wishlists
- submit ratings and reviews
- update their existing ratings

## Authentication and Authorization

### Authentication

Authentication uses JWT.

The backend creates a token with:

- `id`
- `role`
- `email`

The frontend stores the token in `localStorage`.

### Authorization

Authorization is handled in `backend/middlewares/auth.js`.

Two middleware steps are used:

1. `verifyToken`
   - validates the JWT
   - reloads the current user from the database
2. `requireRole`
   - checks whether the current user has a permitted role

### Route access rules

#### Public routes

- `/login`
- `/register`

#### Authenticated shared routes

- `/home`
- `/stores`
- `/stores/:id`
- `/manual`

#### Admin-only

- `/admin`
- `/api/admin/*`

#### Owner-only

- `/owner`
- `/api/stores/owner`
- `/api/stores/owner/ratings`

#### Normal-user-only

- `/wishlists`
- `/api/wishlists/*`
- `/api/ratings/*`

### Important rule

Only `NORMAL` users can submit or update ratings.

## Database Design

The Prisma schema defines the following role enum:

- `ADMIN`
- `NORMAL`
- `STORE_OWNER`

### `User`

Stores:

- name
- email
- password
- address
- role
- timestamps

Relations:

- one optional store for owner accounts
- many ratings
- many wishlists

### `Store`

Stores:

- name
- email
- address
- ownerId
- averageRating
- description
- imageUrl
- timestamps

Relations:

- one owner
- many ratings
- many wishlists

### `Rating`

Stores:

- rating value
- optional review text
- userId
- storeId
- timestamps

Important rule:

- one user can rate one store only once

### `Wishlist`

Stores:

- userId
- storeId
- timestamp

Important rule:

- one user can wishlist one store only once

## API Overview

### Auth routes

- `POST /api/auth/register`
  Register a public normal user
- `POST /api/auth/login`
  Log in
- `PUT /api/auth/password`
  Update current user password

### Admin routes

- `GET /api/admin/dashboard`
  Platform totals
- `GET /api/admin/users`
  List users
- `POST /api/admin/users`
  Create user
- `GET /api/admin/users/:id`
  Get user detail
- `DELETE /api/admin/users/:id`
  Delete user
- `GET /api/admin/stores`
  List stores
- `POST /api/admin/stores`
  Create store

### Store routes

- `GET /api/stores`
  Get store list for authenticated users
- `GET /api/stores/:id`
  Get one store detail
- `GET /api/stores/owner`
  Owner dashboard store summary
- `GET /api/stores/owner/ratings`
  Owner ratings list

### Rating routes

- `POST /api/ratings`
  Submit new rating
- `PUT /api/ratings/:id`
  Update existing rating
- `GET /api/ratings/store/:storeId`
  Get all reviews for one store

### Wishlist routes

- `POST /api/wishlists/toggle`
  Add or remove a store from wishlist
- `GET /api/wishlists`
  Get current user wishlist

## Demo Data and Seeded Credentials

The seed script is in `seed.js`.

It creates:

- 1 admin account
- 5 normal-user accounts
- 20 store-owner accounts
- 20 stores
- starter reviews
- starter wishlist entries

### Important warning

`npm run db:seed` is destructive.

It deletes:

- users
- stores
- ratings
- wishlists

before recreating the demo dataset.

If you reseed a deployed environment:

- existing sessions become stale
- users may need to log in again

### Login ID format

The login ID is always the email address, not the database UUID.

### Admin demo account

- Email: `admin@ratex.com`
- Password: `Secure@123`

### Normal-user demo accounts

- `john.c@mail.com` / `Secure@123`
- `sarah.c@mail.com` / `Secure@123`
- `priya.s@mail.com` / `Secure@123`
- `marcus.b@mail.com` / `Secure@123`
- `elena.v@mail.com` / `Secure@123`

### Store-owner demo accounts

All seeded owner accounts use the same password:

- Password: `Secure@123`

Seeded owner emails:

- `owner1@tech.com`
- `owner2@retail.com`
- `owner3@tech.com`
- `owner4@retail.com`
- `owner5@cafe.com`
- `owner6@tech.com`
- `owner7@grocery.com`
- `owner8@hardware.com`
- `owner9@retail.com`
- `owner10@books.com`
- `owner11@restaurant.com`
- `owner12@gym.com`
- `owner13@retail.com`
- `owner14@tech.com`
- `owner15@clothing.com`
- `owner16@cafe.com`
- `owner17@hardware.com`
- `owner18@bakery.com`
- `owner19@entertainment.com`
- `owner20@service.com`

## Environment Variables

Create a `.env` file using `.env.example`.

### Required variables

| Variable | Purpose | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Runtime database connection | In production, use a pooled connection string |
| `DIRECT_URL` | Direct Prisma CLI connection | Used for Prisma CLI tasks like migrate and seed |
| `JWT_SECRET` | JWT signing secret | Required for auth |
| `PORT` | Local Express port | Used in local backend startup |

### Example

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ratex?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/ratex?schema=public"
JWT_SECRET="supersecretjwtkey"
PORT=3000
```

## Local Development Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

Copy `.env.example` to `.env` and fill in real values.

### 3. Generate Prisma client

```bash
npm run postinstall
```

This also runs automatically during install/build because `postinstall` is configured in `package.json`.

### 4. Apply migrations

```bash
npm run db:migrate
```

### 5. Seed demo data

```bash
npm run db:seed
```

### 6. Start local development

```bash
npm run dev
```

This runs both:

- Vite frontend
- Express backend with nodemon

### 7. Start frontend or backend separately

Frontend only:

```bash
npm run dev:frontend
```

Backend only:

```bash
npm run dev:backend
```

## Database Workflow

### Migration command

```bash
npm run db:migrate
```

This uses:

```bash
prisma migrate deploy
```

### Seed command

```bash
npm run db:seed
```

This runs:

```bash
node seed.js
```

### What the seed does

The seed script:

- wipes old records
- creates demo users
- creates owners
- creates stores
- generates starter ratings and reviews
- creates a few wishlist records

### Safe production note

The seed script refuses to run in production unless:

- `NODE_ENV=production`
- `ALLOW_PRODUCTION_SEED=true`

This is intentionally protective because seeding is destructive.

## Build and Run Commands

### Available scripts

```bash
npm run dev
npm run dev:frontend
npm run dev:backend
npm run build
npm run preview
npm run start
npm run prisma:generate
npm run db:migrate
npm run db:seed
npm run lint
```

### Command reference

- `npm run dev`
  Start frontend and backend together
- `npm run build`
  Build production frontend assets
- `npm run preview`
  Preview the built frontend
- `npm run start`
  Start backend server
- `npm run prisma:generate`
  Generate Prisma client
- `npm run db:migrate`
  Apply migrations
- `npm run db:seed`
  Seed demo data
- `npm run lint`
  Run ESLint

## Deployment on Vercel and Neon

### Deployment model

This repository is prepared for:

- frontend hosting on Vercel
- backend API routing on Vercel
- PostgreSQL on Neon

### Vercel routing

`vercel.json` rewrites:

- `/api/(.*)` to `/api/index.js`
- everything else to `/index.html`

### Recommended production setup

1. Create a PostgreSQL database
2. Prefer Neon for hosted Postgres
3. Set `DATABASE_URL` in Vercel to a pooled runtime connection string
4. Set `DIRECT_URL` in Vercel to the direct database connection string
5. Set `JWT_SECRET`
6. Run `npm run db:migrate`
7. Optionally run `npm run db:seed`
8. Deploy to Vercel

### Neon-specific note

For Neon:

- use the `-pooler` hostname for `DATABASE_URL`
- use the direct non-pooler host for `DIRECT_URL`

### Why pooled and direct URLs are split

This project uses:

- pooled runtime DB connections for the deployed app
- direct connections for Prisma CLI tasks such as migrations and seeding

This is especially important for serverless environments like Vercel.

## Performance Notes

The project has already been adjusted in a few ways to reduce visible loading issues:

- store listing can skip the extra total-count query when the count is not needed
- normal-user store browsing now shows loading placeholders
- wishlist page shows an explicit loading state

For best production performance:

- keep Vercel functions close to the database region
- use pooled runtime DB URLs
- use direct DB URL only for Prisma CLI operations

## Product Rules and Current Limitations

These rules are important when testing or demoing the app.

### Product rules

- only `NORMAL` users can rate stores
- public registration only creates `NORMAL` users
- one user can rate one store only once
- one user can wishlist one store only once
- one owner can own exactly one store

### Validation rules

Public registration and admin user creation both require:

- name length between `20` and `60`
- valid email
- address length up to `400`
- password length between `8` and `16`
- at least one uppercase letter in password
- at least one special character in password

### Current limitations

- admin UI does not currently expose a store creation form even though the backend has a create-store endpoint
- owner dashboard is read-only
- owners cannot edit store data from the current UI
- owners cannot respond to ratings
- `Book Now` is currently only a UI button, not a completed booking workflow
- `Forgot Password?` on the login page is only visual right now
- admin `Settings` tab is currently a placeholder

## Troubleshooting

### Registration fails

Check:

- name length is between `20` and `60`
- password has uppercase and special character
- email is not already in use
- database connection is healthy

### Login fails

Check:

- correct email is being used as login ID
- password is correct
- the account still exists after the last seed run

### Ratings fail for admin or owner

This is expected.

Only `NORMAL` users can submit ratings.

### Owner dashboard shows "No Store Found"

This means:

- the account has role `STORE_OWNER`
- but no store is linked to that owner in the database

### Data appears empty after reseeding

Remember:

- reseeding deletes and recreates users and content
- stale browser sessions may need a fresh login

### Slow loading in production

Check:

- Vercel function region
- Neon connection type
- whether `DATABASE_URL` uses a pooled runtime URL
- whether `DIRECT_URL` is configured correctly

## Additional Project Notes

### Walkthrough document

A role-by-role product explanation is available in:

- `WALKTHROUGH_NOTES.md`

### Assets

Static assets such as images and the manual PDF are kept in `public/`.

### Manual page

The manual is available inside the app on:

- `/manual`

It supports:

- in-browser viewing
- PDF download

### Auth session note

The frontend keeps the JWT in `localStorage`.

If the backend returns `401`:

- the token is cleared
- the user is redirected back to `/login`

### Final summary

RateX is a compact but complete full-stack role-based application with:

- public user registration
- JWT authentication
- admin user management
- owner analytics
- normal-user discovery, wishlist, and rating flows
- Vercel-ready deployment structure
- Prisma-backed PostgreSQL persistence

If you want to understand the product flow at a demo level, start with `WALKTHROUGH_NOTES.md`.

