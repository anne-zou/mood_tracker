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

test('emojiConfigs rejects unauthenticated access', { skip: !hasDb }, async () => {
  const result = await runGraphql(
    `
      query QueryEmojiConfig {
        queryEmojiConfig {
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

test('emojiConfigs CRUD flow', { skip: !hasDb }, async () => {
  const userId = '123';
  await db.query('DELETE FROM emoji_configs WHERE user_id = $1', [userId]);

  /* Upsert a config */
  const upsertResult = await runGraphql(
    `
      mutation UpsertEmojiConfig($content: String!) {
        upsertEmojiConfig(content: $content) {
          id
          content
        }
      }
    `,
    { content: '🙂 😩 😠' },
    { db, userId }
  );
  if (upsertResult.errors?.length) {
    console.error('upsertEmojiConfig errors:', upsertResult.errors);
  }
  assert.ok(!upsertResult.errors);
  assert.equal(upsertResult.data.upsertEmojiConfig.content, '🙂😩😠');
  const configId = upsertResult.data.upsertEmojiConfig.id;

  /* Query the config */
  const queryResult = await runGraphql(
    `
      query QueryEmojiConfig {
        queryEmojiConfig {
          id
          content
        }
      }
    `,
    null,
    { db, userId }
  );
  assert.ok(!queryResult.errors);
  assert.ok(queryResult.data.queryEmojiConfig);

  /* Upsert an existing config for the same user */
  const secondUpsertResult = await runGraphql(
    `
      mutation UpsertEmojiConfig($content: String!) {
        upsertEmojiConfig(content: $content) {
          id
          content
        }
      }
    `,
    { content: '🙂 🫠' },
    { db, userId }
  );
  assert.ok(!secondUpsertResult.errors);
  assert.equal(secondUpsertResult.data.upsertEmojiConfig.id, configId);
  assert.equal(secondUpsertResult.data.upsertEmojiConfig.content, '🙂🫠');
});

test('emojiConfigs returns defaults when missing', { skip: !hasDb }, async () => {
  const userId = '456';
  await db.query('DELETE FROM emoji_configs WHERE user_id = $1', [userId]);
  await db.query('INSERT INTO users (id, email) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING', [
    456,
    'test-456@example.com',
  ]);

  const queryResult = await runGraphql(
    `
      query QueryEmojiConfig {
        queryEmojiConfig {
          id
          userId
          content
        }
      }
    `,
    null,
    { db, userId }
  );

  assert.ok(!queryResult.errors);
  assert.equal(queryResult.data.queryEmojiConfig.id, 'default');
  assert.equal(queryResult.data.queryEmojiConfig.userId, userId);
  assert.equal(queryResult.data.queryEmojiConfig.content, '🙂😩😠🥱');
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
    CREATE TABLE IF NOT EXISTS emoji_configs (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
});
