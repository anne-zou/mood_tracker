import test from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';
import { graphql } from 'graphql';
import { createRootResolvers, schema } from '../schema.js';

const { Pool } = pg;
const DATABASE_URL = process.env.DATABASE_URL;

const hasDb = Boolean(DATABASE_URL);

const db = hasDb
  ? new Pool({
      connectionString: DATABASE_URL,
      ssl:
        process.env.PGSSLMODE === 'require'
          ? { rejectUnauthorized: false }
          : undefined,
    })
  : null;

const rootValue = createRootResolvers();

const runGraphql = async (source, variableValues, contextValue) =>
  graphql({
    schema,
    source,
    rootValue,
    variableValues,
    contextValue,
  });

test('moodEntries rejects unauthenticated access', { skip: !hasDb }, async () => {
  const result = await runGraphql(
    `
      query QueryMoodEntries {
        queryMoodEntries {
          id
        }
      }
    `,
    null,
    { db }
  );

  assert.ok(result.errors?.length);
  assert.match(result.errors[0].message, /Authentication required/);
});

test('moodEntries CRUD flow', { skip: !hasDb }, async () => {
  const userId = '123';
  const now = new Date().toISOString();
  await db.query('DELETE FROM mood_entries WHERE user_id = $1', [userId]);

  /* Create a mood entry */
  const createResult = await runGraphql(
    `
      mutation CreateMoodEntry($content: String!, $time: String!) {
        createMoodEntry(content: $content, time: $time, userId: "123") {
          id
          content
        }
      }
    `,
    { content: 'hello', time: now },
    { db, userId }
  );
  if (createResult.errors?.length) {
    console.error('createMoodEntry errors:', createResult.errors);
  }
  assert.ok(!createResult.errors);
  assert.equal(createResult.data.createMoodEntry.content, 'hello');
  const entryId = createResult.data.createMoodEntry.id;

  /* Query the mood entry */
  const queryResult = await runGraphql(
    `
      query QueryMoodEntries {
        queryMoodEntries {
          id
          content
        }
      }
    `,
    null,
    { db, userId }
  );
  assert.ok(!queryResult.errors);
  assert.equal(queryResult.data.queryMoodEntries.length, 1);

  /* Update the mood entry */
  const updateResult = await runGraphql(
    `
      mutation UpdateMoodEntry($id: ID!, $content: String!) {
        updateMoodEntry(id: $id, content: $content) {
          id
          content
        }
      }
    `,
    { id: entryId, content: 'updated' },
    { db, userId }
  );
  assert.ok(!updateResult.errors);
  assert.equal(updateResult.data.updateMoodEntry.content, 'updated');

  /* Delete the mood entry */
  const deleteResult = await runGraphql(
    `
      mutation DeleteMoodEntry($id: ID!) {
        deleteMoodEntry(id: $id) {
          deleted
        }
      }
    `,
    { id: entryId },
    { db, userId }
  );
  assert.ok(!deleteResult.errors);
  assert.equal(deleteResult.data.deleteMoodEntry.deleted, true);
});

test.after(async () => {
  if (db) {
    await db.end();
  }
});

test.before(async () => {
  if (!db) return;
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      email TEXT UNIQUE
    );
  `);
  await db.query('INSERT INTO users (id, email) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING', [
    123,
    'test-123@example.com',
  ]);
  await db.query(`
    CREATE TABLE IF NOT EXISTS mood_entries (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
});
