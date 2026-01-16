import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import { createHandler } from 'graphql-http/lib/use/express';
import { createRootResolvers, schema } from './graphql/schema.js';

dotenv.config();

const { Pool } = pg;

const app = express();
const PORT = process.env.PORT || 4000;
const DATABASE_URL = process.env.DATABASE_URL;

const pool = DATABASE_URL
  ? new Pool({
      connectionString: DATABASE_URL,
      ssl:
        process.env.PGSSLMODE === 'require'
          ? { rejectUnauthorized: false }
          : undefined,
    })
  : null;

const ensureTables = async () => {
  if (!pool) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password_hash TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS mood_entries (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  if (!pool) {
    return res.json({ status: 'ok', db: 'not_configured' });
  }

  try {
    await pool.query('SELECT 1');
    return res.json({ status: 'ok', db: 'connected' });
  } catch (error) {
    return res.status(500).json({ status: 'error', db: 'failed' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Mood Tracker API' });
});

app.use(
  '/graphql',
  createHandler({
    schema,
    rootValue: createRootResolvers(pool),
    graphiql: process.env.NODE_ENV !== 'production',
  })
);


app.listen(PORT, async () => {
  await ensureTables();
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  if (pool) {
    await pool.end();
  }
  process.exit(0);
});
