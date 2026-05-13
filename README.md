# Anime Tracker App

A full-stack Anime Tracker application built with React, Express, and Postgres. Demonstrates session-based authentication, session rehydration, auth-dependent data fetching, and conditional rendering.

This application is aimed for anime lovers who are looking for a place to track their anime's in a journal-entry-like manner.


## User Stories

**Auth**
- A user can register for an account with a username and password
- A user can log in to an existing account
- A user can log out
- A returning user who has an active session is automatically logged in when they revisit the app

**Todos**
- A logged-in user can see all of their anime entries
- A logged-in user can create a new anime entry by entering a title, status, rating, and notes
- A logged-in user can mark an anime entry as plan to watch, watching, or watched
- A logged-in user can delete an anime entry

## Schema

```
users
─────────────────────────────
user_id       SERIAL PRIMARY KEY
username      TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL

anime_entries
─────────────────────────────
entry_id    SERIAL PRIMARY KEY
title       TEXT NOT NULL
status      TEXT DEFAULT 'plan to watch'
rating      INTEGER
notes       TEXT
user_id     INTEGER REFERENCES users(user_id) ON DELETE CASCADE
```

A user has many anime entries. Deleting a user cascades to delete all of their entries.

## API Contract

### Auth endpoints

| Method | Endpoint             | Request Body             | Response                          |
| ------ | -------------------- | ------------------------ | --------------------------------- |
| POST   | `/api/auth/register` | `{ username, password }` | `{ user_id, username }`           |
| POST   | `/api/auth/login`    | `{ username, password }` | `{ user_id, username }`           |
| DELETE | `/api/auth/logout`   | —                        | `{ message }`                     |
| GET    | `/api/auth/me`       | —                        | `{ user_id, username }` or `null` |

### Anime Entry endpoints (all require authentication)

| Method | Endpoint              | Request Body      | Response                                     |
| ------ | --------------------- | ----------------- | -------------------------------------------- |
| GET    | `/api/animes`          | —                 | `[{ entry_id, title, status, rating, notes, user_id }]` |
| POST   | `/api/animes`          | `{ title, status, rating, notes }`       | `{ entry_id, title, status, rating, notes, user_id }`   |
| PATCH  | `/api/animes/:anime_id` | `{ title, status, rating, notes }` | `{ entry_id, title, status, rating, notes, user_id }`   |
| DELETE | `/api/animes/:anime_id` | —                 | `{ entry_id, title, status, rating, notes, user_id }`   |

## Setup

### 1. Database

Create a local Postgres database:

```sh
createdb anime_tracker_db
```

### 2. Server

```sh
cd server
npm install
cp .env.template .env
```

Open `.env` and fill in your Postgres credentials and a session secret. Then seed the database:

```sh
npm run db:seed
```

Start the server:

```sh
npm run dev
```

The server runs on `http://localhost:8080`.

### 3. Frontend

In a second terminal:

```sh
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`. The Vite dev proxy forwards all `/api` requests to the Express server so session cookies work correctly.

## Seed Users

After running `npm run db:seed`, these accounts are available:

| Username | Password    |
| -------- | ----------- |
| alice    | password123 |
| bob      | password123 |

## Application Structure

```
full-stack-project-remix-JandirGregorio/
├── frontend/               # React app (Vite)
│   ├── src/
│   │   ├── App.jsx         # Root component: currentUser state, session rehydration, auth handlers
│   │   ├── adapters/
│   │   │   ├── auth-adapters.js  # Fetch adapters for /api/auth/* endpoints
│   │   │   └── anime-adapters.js  # Fetch adapters for /api/animes/* endpoints
│   │   └── components/
│   │       ├── AuthPage.jsx    # Login + Register forms (shown when logged out)
│   │       ├── AnimePage.jsx    # Main app container (shown when logged in)
│   │       ├── AddAnimeForm.jsx # Form to create a new anime entry
│   │       ├── AnimeList.jsx    # Renders a list of AnimeItems
│   │       └── AnimeItem.jsx    # Single anime entry: title, status, rating, notes, delete button
│   └── vite.config.js      # Proxies /api requests to Express in development
└── server/                 # Express + Postgres API
    ├── index.js            # App entry point, route definitions
    ├── controllers/
    │   ├── authControllers.js  # register, login, logout, getMe
    │   └── animeControllers.js  # list, create, update, delete todos
    ├── models/
    │   ├── userModel.js    # SQL queries for the users table
    │   └── animeModel.js    # SQL queries for the todos table
    ├── middleware/
    │   ├── checkAuthentication.js  # Blocks unauthenticated requests
    │   └── logRoutes.js            # Logs each incoming request
    └── db/
        ├── pool.js         # Postgres connection pool
        └── seed.js         # Creates tables and inserts sample data
```
