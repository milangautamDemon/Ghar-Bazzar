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
npm run dev
```

Server runs on:

```text
http://localhost:8000
```

## Important

- MongoDB should be running
- Main routes:
  `POST /api/auth/register`
  `POST /api/auth/login`
  `POST /api/fav/toggle`
  `GET /api/fav/lists`
