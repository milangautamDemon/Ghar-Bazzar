# Server

This is the backend part of the project.

## What Is There

- Node.js
- Express
- TypeScript
- MongoDB
- Register API
- Login API
- Favourite APIs

## How To Run

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

`npm run dev` seeds the admin user first, then starts the development server.

For the build flow, use:

```bash
npm run build:start
```

`npm run start` also seeds the admin user first, then runs the built server.

Server runs on:

```text
http://localhost:8000
```

## Seed Admin

Run the admin seed after setting up your `.env` file:

```bash
npm run seed
```

This uses the following optional environment variables:

- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Important

- MongoDB should be running
- Copy `.env.example` to `.env` before starting the server
- Main routes:
  `POST /api/auth/register`
  `POST /api/auth/login`
  `POST /api/fav/toggle`
  `GET /api/fav/lists`
