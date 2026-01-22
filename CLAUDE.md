# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mood Logger is a lightweight app for logging moods and thoughts in a chat-like interface. It's a monorepo with separate `frontend/` and `backend/` directories.

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
- `app/_layout.tsx` - Root layout with GestureHandler and PaperProvider setup
- `app/index.tsx` - Auth landing page with Google OAuth
- `app/home.tsx` - Main mood tracking screen
- `app/components/` - Reusable components (EmojiRow, MoodInputBar, MessageList)
- `app/styles/` - Shared styles
- `lib/supabase.ts` - Supabase client for frontend authentication

### GraphQL API
- Endpoint: `http://localhost:4000/graphql`
- Auth: Bearer token in Authorization header (validated via Supabase)
- Context provides: `userId`, `accessToken`, `db` (pg Pool)

## Environment Variables

### Backend (`backend/.env`)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Signing key for auth tokens
- `SUPABASE_KEY` - Supabase service role key for server-side auth

### Frontend (`frontend/.env`)
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous/public key for client-side auth

Note: Frontend environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the app.

## Authentication

The app uses Supabase for authentication with Google OAuth:
- Frontend initiates OAuth flow via `supabase.auth.signInWithOAuth()`
- OAuth redirects to `moodlogger://auth/callback`
- Session state is managed by Supabase auth state listener
- Backend validates JWT tokens from Supabase

## UI Patterns

### Edit Mode Dimming

When a mood entry is being edited, all other UI elements are dimmed to create visual focus. This is a critical UX pattern that **MUST** be applied to all new UI components.

**Implementation:**
1. Import dimming utilities: `import { createDimmedStyle } from '../../styles/dimming';`
2. Add `dimmed?: boolean` prop to your component's props type
3. Apply dimmed style conditionally: `style={[styles.myComponent, dimmed && styles.dimmed]}`
4. Add to StyleSheet: `dimmed: createDimmedStyle(),`
5. Pass dimming state from parent: `dimmed={!!editingEntryId}` or `dimmed={isAnotherEditing}`

**Example:**
```typescript
import { createDimmedStyle } from '../../styles/dimming';

type MyComponentProps = {
  content: string;
  dimmed?: boolean;
};

export default function MyComponent({ content, dimmed = false }: MyComponentProps) {
  return (
    <View style={[styles.container, dimmed && styles.dimmed]}>
      <Text>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  dimmed: createDimmedStyle(),
});
```

See `frontend/styles/dimming.ts` for complete documentation and examples.
