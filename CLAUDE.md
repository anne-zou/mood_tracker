# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mood Tracker is a lightweight app for logging moods and thoughts in a chat-like interface. It's a monorepo with separate `frontend/` and `backend/` directories.

## Tech Stack

- **Frontend**: React Native + Expo (TypeScript)
- **Backend**: Node.js + Express + GraphQL (JavaScript ES modules, requires Node >= 22)
- **Database**: PostgreSQL
- **Auth**: Supabase

## Common Commands

### Frontend (from `frontend/`)
```bash
npm start         # Start Expo dev server
npm run ios       # Start on iOS simulator
npm run android   # Start on Android emulator
npm run web       # Start web version
npm run lint      # Run ESLint
npm run lint:fix  # Run ESLint with auto-fix
```

### Backend (from `backend/`)
```bash
npm start                           # Start server (http://localhost:4000)
npm test                            # Run all tests
node --test --import dotenv/config  # Run tests (explicit)
```

To run a single test file:
```bash
node --test --import dotenv/config graphql/moodEntries/moodEntries.test.js
```

## Architecture

### Backend Structure
- `server.js` - Express server setup, middleware (auth, CORS), GraphQL endpoint at `/graphql`
- `supabase.js` - Supabase client for authentication
- `graphql/schema.js` - Main GraphQL schema combining all domain modules
- `graphql/<domain>/` - Domain-specific GraphQL modules (e.g., `moodEntries/`)
  - Each domain exports: type definitions, query/mutation fields, and resolver factory

The server auto-creates required database tables on startup via `ensureTables()`.

### Frontend Structure
- Uses Expo Router for file-based routing in `app/`
- `app/_layout.tsx` - Root layout with GestureHandler setup
- `app/index.tsx` - Entry point
- `app/home.tsx` - Main mood tracking screen
- `app/auth/` - Login/signup screens
- `app/components/` - Reusable components (EmojiRow, MoodInputBar, MoodMessageList)
- `app/styles/` - Shared styles

### GraphQL API
- Endpoint: `http://localhost:4000/graphql`
- Auth: Bearer token in Authorization header (validated via Supabase)
- Context provides: `userId`, `accessToken`, `db` (pg Pool)

## Environment Variables

Backend requires `backend/.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Signing key for auth tokens
- Supabase credentials (see `supabase.js`)
