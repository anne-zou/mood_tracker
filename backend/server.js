import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import { createHandler } from 'graphql-http/lib/use/express';
import { createRootResolvers, schema } from './graphql/schema.js';
import supabase from './supabase.js';

dotenv.config();

const { Pool } = pg;

const app = express();
const PORT = process.env.PORT || 4000;
const DATABASE_URL = process.env.DATABASE_URL;

const db = DATABASE_URL
  ? new Pool({
      connectionString: DATABASE_URL,
      ssl:
        process.env.PGSSLMODE === 'require'
          ? { rejectUnauthorized: false }
          : undefined,
    })
  : null;

app.use(cors());
app.use(express.json());

/**
 * Ensure the database is configured
 */
app.use((req, res, next) => {
  if (!db) {
    return res.status(500).json({ error: 'Database not configured' });
  }
  return next();
});

/**
 * If user is logged in, set the userId in the request context
 */
app.use(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    req.userId = null;
    return next();
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.userId = data.user.id;
  return next();
});

/**
 * Health check endpoint
 */
app.get('/health', async (req, res) => {
  if (!db) {
    return res.json({ status: 'ok', db: 'not_configured' });
  }

  try {
    await db.query('SELECT 1');
    return res.json({ status: 'ok', db: 'connected' });
  } catch (error) {
    return res.status(500).json({ status: 'error', db: 'failed' });
  }
});

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({ message: 'Mood Tracker API' });
});

/**
 * GraphQL endpoint
 */
app.use(
  '/graphql',
  createHandler({
    schema,
    rootValue: createRootResolvers(),
    context: (req) => ({ userId: req.userId, db }),
    graphiql: process.env.NODE_ENV !== 'production',
  })
);

/**
 * Start the server
 */
app.listen(PORT, async () => {
  await ensureTables();
  console.log(`Server running on http://localhost:${PORT}`);
});

/**
 * Ensure the tables are created
 */
const ensureTables = async () => {
  if (!db) return;
  await db.query(`
    CREATE TABLE IF NOT EXISTS mood_entries (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      content TEXT NOT NULL,
      time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

/**
 * Gracefully shutdown the server
 */
process.on('SIGINT', async () => {
  if (db) {
    await db.end();
  }
  process.exit(0);
});
