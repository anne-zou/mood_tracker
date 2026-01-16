# Mood Tracker

Mood Tracker is a lightweight app for logging moods and thoughts in a chat-like interface.

## Tech Stack

- Frontend: React Native + Expo
- Backend: Node.js + Express + GraphQL
- Database: PostgreSQL

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm start
```

## Environment Variables

Backend expects:

- `DATABASE_URL` (Postgres connection string)
- `JWT_SECRET` (signing key for auth tokens)

## GraphQL Endpoint

- `http://localhost:4000/graphql`

## Scripts

- `frontend`: `npm run dev`
- `backend`: `npm start`
