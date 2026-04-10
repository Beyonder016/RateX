# RateX Walkthrough Notes

This document explains the current RateX project in four parts:

1. Understanding project workflow
2. Admin walkthrough
3. Owner walkthrough
4. User walkthrough

These notes are based on the current codebase and the seeded demo data in `seed.js`.

## Part 1 - Understanding Project Workflow

### 1. Project purpose

RateX is a role-based store discovery and rating web application.

The platform supports three main account types:

- `ADMIN`
- `STORE_OWNER`
- `NORMAL` user

At a high level, the app allows:

- admins to manage users and monitor platform data
- store owners to view their store performance and customer ratings
- normal users to browse stores, maintain wishlists, and submit ratings and reviews

### 2. Platforms and technologies used

The project uses the following main platforms and tools:

- `React` for the frontend UI
- `Vite` for frontend development and build output
- `Express` for backend API routes
- `Prisma` as the ORM
- `PostgreSQL` as the database
- `Neon` as the hosted Postgres provider in production
- `Vercel` for deployment and hosting
- `JWT` for authentication
- `Axios` for frontend-to-backend API requests
- `localStorage` for keeping the JWT token in the browser
- `GitHub` as the repository/workspace

### 3. Top-level file structure

Important folders and files:

- `src/`
  Frontend React application
- `src/pages/`
  Main UI screens such as login, register, admin dashboard, owner dashboard, store listing, store details, wishlists, and manual viewer
- `src/context/AuthContext.jsx`
  Stores login state, token, decoded user payload, and logout behavior
- `src/api.js`
  Central Axios instance with auth token injection
- `api/index.js`
  Express app entry used by Vercel serverless routing
- `backend/controllers/`
  Business logic for auth, admin, stores, ratings, and wishlists
- `backend/routes/`
  Express route definitions
- `backend/middlewares/auth.js`
  JWT verification and role authorization
- `backend/prisma.js`
  Shared Prisma client instance
- `prisma/schema.prisma`
  Database schema
- `prisma/migrations/`
  Prisma migration files
- `seed.js`
  Demo data seeding script
- `server.js`
  Local Express server startup file
- `vercel.json`
  Deployment routing configuration for Vercel
- `public/`
  Static assets such as images and the PDF manual
- `README.md`
  Basic project setup and deployment notes

### 4. How the frontend is organized

The frontend is built around route-based pages.

Important pages:

- `Login.jsx`
  Login screen for all existing users
- `Register.jsx`
  Public signup screen for normal users
- `LandingPage.jsx`
  Shared home page after login
- `AdminDashboard.jsx`
  Admin-only management dashboard
- `OwnerDashboard.jsx`
  Store owner dashboard
- `NormalDashboard.jsx`
  Store browsing page
- `StoreDetails.jsx`
  Detailed page for an individual store, including ratings and reviews
- `Wishlists.jsx`
  Wishlist page for normal users
- `ManualViewer.jsx`
  Embedded website manual PDF viewer

### 5. How routing works

Routing is defined in `src/App.jsx`.

Main behavior:

- `/login`
  Public login page
- `/register`
  Public registration page
- `/home`
  Shared landing page for all authenticated roles
- `/admin`
  Admin-only dashboard
- `/owner`
  Owner-only dashboard
- `/stores`
  Store browsing page for all authenticated roles
- `/stores/:id`
  Store details page for all authenticated roles
- `/wishlists`
  Normal-user-only wishlist page
- `/manual`
  Manual page for all authenticated roles

The app uses a `ProtectedRoute` wrapper to check:

- whether a user is logged in
- whether the user has the required role

### 6. How authentication works

Authentication flow:

1. User submits login credentials from `Login.jsx`
2. Frontend sends `POST /api/auth/login`
3. Backend verifies email and password
4. Backend signs a JWT containing:
   - user `id`
   - user `role`
   - user `email`
5. Frontend stores the token in `localStorage`
6. `AuthContext.jsx` decodes the token payload and stores user info in React state
7. `src/api.js` adds the JWT as `Authorization: Bearer <token>` on each request

Important behavior:

- if the token is invalid or the user no longer exists, the API returns `401`
- the frontend removes the token and redirects back to `/login`

### 7. How registration works

Public registration is only for `NORMAL` users.

Flow:

1. User opens `/register`
2. User fills:
   - full name
   - email
   - address
   - password
3. Frontend sends `POST /api/auth/register`
4. Backend validates the data using `express-validator`
5. Password is hashed using `bcrypt`
6. New user is created with role `NORMAL`

Registration validation rules:

- name must be between `20` and `60` characters
- email must be valid
- address max length is `400`
- password must be `8` to `16` characters
- password must contain at least one uppercase letter
- password must contain at least one special character

### 8. How the backend API is organized

The Express app lives in `api/index.js`.

API groups:

- `/api/auth`
  Login, register, password update
- `/api/admin`
  Admin dashboard data and user/store management
- `/api/stores`
  Store browsing, owner store info, owner ratings list, store details
- `/api/ratings`
  Submit rating, update rating, fetch store reviews
- `/api/wishlists`
  Toggle wishlist and fetch current wishlist

### 9. How role-based access works

Authorization is enforced in `backend/middlewares/auth.js`.

The middleware does two steps:

1. `verifyToken`
   - validates JWT
   - loads the current user from the database
2. `requireRole`
   - allows the route only if the logged-in user’s role is permitted

Current role access:

- `ADMIN`
  Admin routes only
- `STORE_OWNER`
  Owner dashboard routes
- `NORMAL`
  Rating and wishlist routes
- `NORMAL`, `ADMIN`, `STORE_OWNER`
  General store browsing and store detail routes

Important rule:

- only `NORMAL` users can submit or edit ratings

### 10. How store browsing works

Store browsing is handled by:

- frontend: `src/pages/NormalDashboard.jsx`
- backend: `getStoresWithUserRating()` in `backend/controllers/storeController.js`

Flow:

1. Frontend requests `/api/stores`
2. Backend fetches stores from Prisma
3. Backend also checks:
   - whether the current user has rated each store
   - whether the current user has wishlisted each store
4. Frontend renders store cards

Each store card shows:

- image
- name
- shortened address
- average rating
- wishlist icon

### 11. How store detail and review flow works

The detailed store page is `StoreDetails.jsx`.

It loads:

- core store details
- current user rating, if present
- total review count
- review list when the review panel is opened

Actions on the page:

- view store image and description
- open the reviews panel
- rate the store
- update an existing rating
- view the number of total reviews

Rating workflow:

1. Normal user opens a store
2. Clicks `Rate Us`
3. Submits star rating and optional review text
4. Frontend calls:
   - `POST /api/ratings` for first-time rating
   - `PUT /api/ratings/:id` for updating an existing rating
5. Backend recalculates the store average rating

### 12. How wishlists work

Wishlists are only available to normal users.

Handled by:

- frontend: `Wishlists.jsx`
- backend: `wishlistController.js`

Features:

- add/remove a store from wishlist from the store browsing screen
- view all wishlisted stores on `/wishlists`

### 13. How admin management works in the backend

Admin APIs provide:

- dashboard counts
- user listing
- user creation
- user deletion
- store listing
- store creation API

Important admin-side rule:

- deleting a store owner also deletes:
  - their store
  - store ratings
  - related wishlists

### 14. How owner reporting works

The owner dashboard loads:

- the owner’s assigned store
- all ratings for that store
- average rating
- total review count
- rating distribution

If a store owner account exists but has no store assigned, the owner sees a “No Store Found” state.

### 15. How the database is structured

The Prisma schema contains:

- `User`
  Holds all platform users
- `Store`
  Holds store records
- `Rating`
  Holds store ratings and optional review text
- `Wishlist`
  Holds saved user-store pairs

Role enum:

- `ADMIN`
- `NORMAL`
- `STORE_OWNER`

Important DB relationships:

- one owner can own one store
- one user can rate a specific store only once
- one user can wishlist a specific store only once

### 16. How demo data is created

`seed.js` creates demo content for walkthroughs and testing.

It creates:

- one admin account
- five normal-user accounts
- twenty owner accounts
- twenty stores
- starter reviews and ratings
- a few wishlist entries

Important note:

- running the seed wipes existing users, stores, ratings, and wishlists first

### 17. How local development works

Main scripts from `package.json`:

- `npm run dev`
  Starts frontend and backend together
- `npm run dev:frontend`
  Starts Vite dev server
- `npm run dev:backend`
  Starts backend with nodemon
- `npm run build`
  Builds the frontend
- `npm run start`
  Runs the server
- `npm run db:migrate`
  Applies Prisma migrations
- `npm run db:seed`
  Seeds demo data

### 18. How deployment works

Deployment is configured for Vercel.

`vercel.json` does two key things:

- routes `/api/*` to `api/index.js`
- routes everything else to `index.html`

Production flow:

1. Frontend is built by Vite
2. Vercel serves the static frontend
3. API requests are handled by the Express app through Vercel routing
4. Prisma connects to PostgreSQL in Neon

### 19. End-to-end workflow summary

Full application workflow:

1. User opens the site
2. User logs in or registers
3. JWT is stored in browser local storage
4. Protected routes unlock based on role
5. Frontend calls backend API using Axios
6. Express validates token and role
7. Prisma reads/writes database records
8. UI updates based on returned data

---

## Part 2 - Admin Walkthrough

### 1. Admin login details

Admin demo credentials:

- Email: `admin@ratex.com`
- Password: `Secure@123`

Important note:

- the app uses email as the login ID
- the admin is not created through the public register page
- this account comes from the seed data

### 2. Admin login experience

The admin starts on the shared login page:

- enters email and password
- submits the form
- receives a JWT token
- is redirected into the authenticated part of the app

After login:

- the app lands on `/home`
- the landing page shows a dashboard card
- clicking the admin dashboard card opens `/admin`

### 3. Admin account creation path

Admins are generally created in one of two ways:

- by seed data
- by another admin using the admin dashboard user creation form

There is no public self-signup flow for admin accounts.

### 4. Admin home experience

On the shared landing page, the admin can:

- view the styled landing/marketing page
- open the dashboard card
- browse stores through the store exploration card
- open the website manual
- log out

### 5. Admin dashboard overview

The admin dashboard contains a left sidebar and multiple tabs.

Sidebar tabs:

- Dashboard
- Users
- Stores
- Owners
- Ratings
- Settings

The page also includes:

- a search box
- profile chip/avatar
- feedback banners for create/delete actions

### 6. Dashboard tab

This tab gives the admin a snapshot of the platform.

Visible metrics:

- total users
- total stores
- total ratings
- total owners

It also shows:

- recent users table
- recent stores table

Purpose:

- quick health check of the platform
- navigation entry point to users and stores

### 7. Users tab

This is the most active admin management area.

The admin can:

- create new users
- view all existing users
- search users
- sort user rows by name, email, role
- remove users

Create user form fields:

- full name
- email
- address
- password
- role selector

Allowed roles from the form:

- `NORMAL`
- `STORE_OWNER`
- `ADMIN`

Validation rules are the same as public registration:

- name must be 20 to 60 characters
- password must be 8 to 16 characters
- password must include uppercase and special character

Delete behavior:

- admin cannot delete their own current account from the table
- deleting a normal user removes their own ratings and wishlists
- deleting a store owner removes their store and store-related data too
- deleting the last admin is blocked by backend logic

### 8. Stores tab

This tab lists all stores in the platform.

Admin can view:

- store name
- store email
- owner name
- store address
- average rating

The list supports:

- searching
- sorting by name, email, average rating

Important limitation:

- the backend supports store creation, but the current admin UI does not expose a store creation form

### 9. Owners tab

This tab shows owner-focused information.

Admin can view:

- owner name
- owner email
- linked store name
- store rating

This is useful for:

- checking whether owners are linked to stores
- spotting owners without stores
- monitoring store health at owner level

### 10. Ratings tab

This tab is a quick ratings overview.

It shows:

- total ratings count
- card-style overview of stores with current average rating

Purpose:

- lets admin see rating coverage across stores

### 11. Settings tab

Current behavior:

- placeholder only
- no active settings controls yet

### 12. Admin relationship with other roles

Admin is the only role that can directly manage accounts through the UI.

Admin can:

- create normal users
- create store-owner users
- create additional admin users
- delete user accounts

Admin cannot currently rate stores in practice:

- admin can browse stores
- but the rating flow is restricted to normal users only

### 13. Admin walkthrough summary

Typical admin session:

1. Log in with admin credentials
2. Land on shared home page
3. Open dashboard card
4. Review platform stats
5. Create or search users
6. Review owners and stores
7. Check ratings overview
8. Log out

---

## Part 3 - Owner Walkthrough

### 1. Owner login details

All owner demo accounts use email as login ID and share the same password:

- Password for all seeded owners: `Secure@123`

Seeded owner accounts:

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

### 2. Owner account creation path

Store owners are not created through the public register page.

Owner accounts are created through:

- seed data
- admin user creation form

Important note:

- simply creating a `STORE_OWNER` user is not enough for the full dashboard experience
- the owner must also have a `Store` record assigned to them

### 3. Owner login experience

Owner starts from the shared login page:

- enters owner email
- enters password
- logs in

After login:

- owner lands on `/home`
- the landing page shows a dashboard card labeled for owner access
- clicking that card opens `/owner`

### 4. Owner home experience

On the shared landing page, owner can:

- view the common landing page visuals
- open owner dashboard
- browse stores
- open the website manual
- log out

### 5. Owner dashboard purpose

The owner dashboard is focused on one store only.

It is designed to answer:

- what is my store’s average rating
- how many reviews do I have
- how are ratings distributed
- who rated my store

### 6. What the owner sees when a store is assigned

Main areas of the owner dashboard:

- top stats cards
- rating breakdown chart
- store info card
- detailed ratings table

Key information shown:

- store name
- store contact email
- store address
- average rating
- total review count
- rating distribution across 5 to 1 stars

### 7. Rating breakdown section

This section shows:

- 5-star count
- 4-star count
- 3-star count
- 2-star count
- 1-star count

Each row includes a progress bar showing the percentage share of that rating.

This helps owners quickly understand customer sentiment.

### 8. Store info card

This card summarizes:

- store name
- store address
- average rating
- total reviews

This acts as the owner’s quick-glance identity panel for the store.

### 9. Ratings table

This table shows the people who rated the owner’s store.

Columns:

- user name
- user email
- star rating
- date

Sorting options:

- sort by rating value
- sort by rating date

### 10. What an owner cannot do

Current owner limitations:

- cannot create stores from the UI
- cannot edit store profile details from the current dashboard
- cannot respond to reviews
- cannot rate stores
- cannot manage other users

### 11. No-store state

If an owner account exists without a linked store:

- the dashboard shows a “No Store Found” message
- the screen advises the user to contact the administrator

This is important for demos because owner access depends on store assignment, not only role.

### 12. Owner walkthrough summary

Typical owner session:

1. Log in with owner credentials
2. Open owner dashboard from landing page
3. Review store summary
4. Check average rating and review count
5. Inspect rating distribution
6. Review the list of users who rated the store
7. Log out

---

## Part 4 - User Walkthrough

### 1. User login and registration details

Public registration is available only for normal users.

Seeded normal-user demo accounts:

- `john.c@mail.com` / `Secure@123`
- `sarah.c@mail.com` / `Secure@123`
- `priya.s@mail.com` / `Secure@123`
- `marcus.b@mail.com` / `Secure@123`
- `elena.v@mail.com` / `Secure@123`

### 2. User registration experience

Normal users can create their own accounts from `/register`.

Form fields:

- full name
- email
- address
- password

Validation rules:

- full name must be 20 to 60 characters
- password must be 8 to 16 characters
- password must include uppercase letter
- password must include special character

After successful registration:

- the app shows a success alert
- user is redirected to `/login`

### 3. User login experience

User logs in through `/login`.

After successful login:

- token is saved in local storage
- app redirects to authenticated space
- landing page is shown at `/home`

### 4. User landing page experience

On the landing page, the normal user can:

- view the visual hero section
- open the `Browse Stores` card
- access the website manual
- use the top header `Wishlists` shortcut
- log out

The dashboard card is not shown to normal users.

### 5. Store browsing experience

The main user experience starts on `/stores`.

The store browser includes:

- search bar
- store cards with images
- store rating badge
- wishlist heart button
- click-through navigation to store details

Store card content:

- store name
- address snippet
- average rating
- wishlist state

### 6. Search behavior

The search input filters stores using backend query parameters.

Users can search by:

- store name
- address

The UI refreshes the store list as search changes.

### 7. Wishlist behavior

Normal users can save stores to a wishlist.

How it works:

- click the heart icon on a store card
- backend toggles the wishlist record
- heart style updates based on wishlisted state

The user can later open `/wishlists` to see saved stores.

### 8. Wishlist page experience

The wishlist page shows:

- all saved stores
- each store’s image
- store name
- address snippet
- average rating
- heart icon for removing it from wishlist

If no saved stores exist:

- the page shows an empty-state message

### 9. Store details experience

When a normal user opens `/stores/:id`, they see:

- large hero-style store image
- address
- description
- average rating
- total number of reviews
- `Book Now` button
- `Rate Us` button

The page also includes a review panel that displays:

- review author name
- rating value
- review text
- time/date

### 10. Rating and review experience

Only normal users can use the rating flow.

How it works:

1. Open store details
2. Click `Rate Us`
3. Choose 1 to 5 stars
4. Optionally type review text
5. Submit the rating

Behavior:

- first submission creates a rating
- later submission updates the existing rating
- store average rating is recalculated on the backend

The user can also open the reviews panel to inspect other reviews.

### 11. Rating restrictions

Important user rules:

- one user can rate one store only once at a time
- the rating can be updated later
- rating value must be between 1 and 5

### 12. Manual page

The user can open `/manual` from the header.

This page:

- embeds the project PDF manual
- provides a download button

### 13. User walkthrough summary

Typical normal-user session:

1. Register a new account or log in with a seeded account
2. Land on `/home`
3. Open `Browse Stores`
4. Search stores
5. Add stores to wishlist
6. Open a store detail page
7. Read existing reviews
8. Submit or update a rating
9. Open wishlists page
10. Read or download the manual
11. Log out

---

## Final Notes

### Seed reset note

If `seed.js` is run again:

- old demo users are deleted
- new IDs are created
- the seeded email/password credentials remain the same unless the seed script changes

### Login ID reminder

In all walkthroughs, the login ID is the user’s email address, not the database UUID.

### Role behavior reminder

- `ADMIN` manages users and platform overview
- `STORE_OWNER` sees only owner reporting for their assigned store
- `NORMAL` user has the full consumer flow including wishlist and ratings

