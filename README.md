# Mood Logger

Mood Logger is a lightweight app for logging moods and events throughout the day in a chat-like interface.

## Stack

- Frontend: React Native + Expo
- Backend: Node.js + Express + GraphQL
- Database: PostgreSQL
- Auth: Supabase

## Scripts

### Frontend

```bash
cd frontend
npm install
npm run start
```

### Backend

```bash
cd backend
npm install
npm start
```

### GraphQL Tests

```bash
cd backend
npm test
```

Single-suite runs:
```bash
cd backend
npm run test:emojiConfigs
npm run test:moodEntries
```

## Environment Variables

Backend expects a `backend/.env` file with the following variables set:
- `DATABASE_URL=...` (Postgres connection string)
- `JWT_SECRET=...` (signing key for auth tokens)

To run integration tests for backend graphQL endpoints:
```
cd backend

```

## GraphQL Endpoint

- `http://localhost:4000/graphql` 
