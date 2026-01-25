import emojiRegex from 'emoji-regex';

export const DEFAULT_EMOJI_CONFIG = {
  id: 'default',
  content: '🙂😩😠🥱',
};

const mapEmojiConfig = (row) => ({
  id: row.id,
  userId: row.user_id,
  content: row.content,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const sanitizeEmojiContent = (value) => {
  if (value == null) {
    return '';
  }
  const matches = value.match(emojiRegex()) ?? [];
  return matches.join('').trim();
};

export const emojiConfigTypeDefs = `
  type EmojiConfig {
    id: ID!
    userId: ID!
    content: String!
    createdAt: String!
    updatedAt: String!
  }
`;

export const emojiConfigQueryFields = `
  emojiConfig: EmojiConfig
`;

export const emojiConfigMutationFields = `
  upsertEmojiConfig(input: UpsertEmojiConfigInput!): UpsertEmojiConfigPayload!
`;

export const emojiConfigInputTypes = `
  input UpsertEmojiConfigInput {
    content: String!
    clientMutationId: String
  }

  type UpsertEmojiConfigPayload {
    emojiConfig: EmojiConfig!
    clientMutationId: String
  }
`;

export const createEmojiConfigResolvers = () => ({
  upsertEmojiConfig: (args, context) => upsertEmojiConfig(args, context),
  emojiConfig: (_args, context) => emojiConfig(context),
});

const upsertEmojiConfig = async ({ input }, context) => {
  const db = context?.db;
  if (!context?.userId) {
    throw new Error('Authentication required');
  }
  const { content, clientMutationId } = input;
  const sanitizedContent = sanitizeEmojiContent(content);
  const result = await db.query(
    `
      INSERT INTO emoji_configs (user_id, content)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET
        content = EXCLUDED.content,
        updated_at = NOW()
      RETURNING *
    `,
    [context.userId, sanitizedContent]
  );
  return {
    emojiConfig: mapEmojiConfig(result.rows[0]),
    clientMutationId,
  };
};


const emojiConfig = async (context) => {
  const db = context?.db;
  if (!context?.userId) {
    throw new Error('Authentication required');
  }

  const result = await db.query(
    'SELECT * FROM emoji_configs WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
    [context.userId]
  );
  if (result.rows[0]) {
    return mapEmojiConfig(result.rows[0]);
  } else {
    // If the user has no emoji config, return the default emojis
    const now = new Date().toISOString();
    return {
      id: DEFAULT_EMOJI_CONFIG.id,
      userId: context.userId,
      content: DEFAULT_EMOJI_CONFIG.content,
      createdAt: now,
      updatedAt: now,
    };
  }
};
