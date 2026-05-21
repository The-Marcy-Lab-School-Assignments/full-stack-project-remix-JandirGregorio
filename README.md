# Otaroku - Anime Tracker App

Tired of keeping track of anime on your notes app or trying to remember if you've already watched a series?

Same.

**Otaroku** is a personal anime tracking app built for fans who want one dedicated place to manage everything they've watched, are currently watching, plan to watch, or even if you stopped watching one. No more scattered notes or forgotten titles — just a clean, organized list that's entirely yours, color-coded by status and built to grow with your watchlist.

A full-stack Anime Tracker application built with React, Express, and Postgres. Demonstrates session-based authentication, session rehydration, auth-dependent data fetching, and conditional rendering.

## Why Otaroku?

The name is a blend of two words: **otaku** (おたく) — the Japanese term 
for a passionate anime fan — and **kiroku** (記録) — the Japanese word for 
"record" or "log." Put them together and you get a name that speaks 
directly to what this app is: a personal record-keeper built for fans.

## Features

- Track anime by status: **Plan to Watch**, **Watching**, **Completed**, or **Dropped**
- Color-coded cards per status for instant visual recognition
- Log a **rating** (1–10), **season**, **episode**, and personal **notes** per entry
- Change an entry's status directly from the card via an inline dropdown
- Full **edit modal** to update any field without leaving the page
- Notes are scrollable on the card — write full reviews without cluttering the UI
- Per-user data: each account only sees their own entries
- Returning users with an active session are automatically logged back in

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
season      INTEGER
episode     INTEGER
rating      INTEGER CHECK (rating >= 1 AND rating <= 10)
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

| Method | Endpoint               | Request Body                                          | Response                                                                 |
| ------ | ---------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------ |
| GET    | `/api/anime`           | —                                                     | `[{ entry_id, title, status, season, episode, rating, notes, user_id }]` |
| POST   | `/api/anime`           | `{ title, status, rating, season, episode, notes }`   | `{ entry_id, title, status, season, episode, rating, notes, user_id }`   |
| PATCH  | `/api/anime/:entry_id` | `{ title, status, rating, season, episode, notes }`   | `{ entry_id, title, status, season, episode, rating, notes, user_id }`   |
| DELETE | `/api/anime/:entry_id` | —                                                     | `{ entry_id, title, status, season, episode, rating, notes, user_id }`   |

Status values are normalized to lowercase on the server. Valid values: `plan to watch`, `watching`, `completed`, `dropped`.

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
│   │   │   ├── auth-adapters.js   # Fetch adapters for /api/auth/* endpoints
│   │   │   └── anime-adapters.js  # Fetch adapters for /api/anime/* endpoints
│   │   └── components/
│   │       ├── AuthPage.jsx          # Login + Register forms (shown when logged out)
│   │       ├── AnimePage.jsx         # Main app container (shown when logged in)
│   │       ├── AddAnimeEntryForm.jsx # Form to create a new anime entry
│   │       ├── EditEntryForm.jsx     # Modal form to update an existing anime entry
│   │       ├── AnimeList.jsx         # Renders a list of AnimeItems
│   │       └── AnimeItem.jsx         # Single entry card: title, status dropdown, season, episode, rating, notes, edit/delete
│   └── vite.config.js      # Proxies /api requests to Express in development
└── server/                 # Express + Postgres API
    ├── index.js            # App entry point, route definitions
    ├── controllers/
    │   ├── authControllers.js   # register, login, logout, getMe
    │   └── animeControllers.js  # list, create, update, delete anime entries
    ├── models/
    │   ├── userModel.js    # SQL queries for the users table
    │   └── animeModel.js   # SQL queries for the anime_entries table
    ├── middleware/
    │   ├── checkAuthentication.js  # Blocks unauthenticated requests
    │   └── logRoutes.js            # Logs each incoming request
    └── db/
        ├── pool.js         # Postgres connection pool
        └── seed.js         # Creates tables and inserts sample data
```