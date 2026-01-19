const mapMoodEntry = (row) => ({
  id: row.id,
  userId: row.user_id,
  content: row.content,
  time: row.time,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const moodEntryTypeDefs = `
  type MoodEntry {
    id: ID!
    userId: ID!
    content: String!
    time: String!
    createdAt: String!
    updatedAt: String!
  }
`;

export const moodEntryQueryFields = `
  queryMoodEntries(startTime: String, endTime: String, limit: Int, offset: Int): [MoodEntry!]!
`;

export const moodEntryMutationFields = `
  createMoodEntry(userId: ID!, content: String!, time: String!): MoodEntry!
  updateMoodEntry(id: ID!, content: String, time: String): MoodEntry!
  deleteMoodEntry(id: ID!): DeleteResponse!
`;

export const createMoodEntryResolvers = () => ({
  createMoodEntry: (args, context) => createMoodEntry(args, context),
  updateMoodEntry: (args, context) => updateMoodEntry(args, context),
  deleteMoodEntry: (args, context) => deleteMoodEntry(args, context),
  queryMoodEntries: (args, context) => queryMoodEntries(args, context),
});

const createMoodEntry = async ({ userId, content, time }, context) => {
  const db = context?.db;
  if (!context?.userId) {
    throw new Error('Authentication required');
  }
  const result = await db.query(
    'INSERT INTO mood_entries (user_id, content, time) VALUES ($1, $2, $3) RETURNING *',
    [Number(userId), content, time]
  );
  return mapMoodEntry(result.rows[0]);
};

const updateMoodEntry = async ({ id, content, time }, context) => {
  const db = context?.db;
  if (!context?.userId) {
    throw new Error('Authentication required');
  }
  const result = await db.query(
    `
      UPDATE mood_entries
      SET
        content = COALESCE($1, content),
        time = COALESCE($2, time),
        updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `,
    [content ?? null, time ?? null, Number(id)]
  );

  if (result.rowCount === 0) {
    throw new Error('Mood entry not found');
  }

  return mapMoodEntry(result.rows[0]);
};

const deleteMoodEntry = async ({ id }, context) => {
  const db = context?.db;
  if (!context?.userId) {
    throw new Error('Authentication required');
  }
  const result = await db.query(
    'DELETE FROM mood_entries WHERE id = $1 RETURNING *',
    [Number(id)]
  );

  if (result.rowCount === 0) {
    throw new Error('Mood entry not found');
  }

  return { deleted: true };
};

const queryMoodEntries = async ({ startTime, endTime, limit, offset }, context) => {
  const db = context?.db;
  if (!context?.userId) {
    throw new Error('Authentication required');
  }
  if (startTime && endTime) {
    if (startTime > endTime) {
      throw new Error('startTime must be before endTime');
    }
  }
  const parsedLimit = Number.isInteger(limit) ? Math.max(0, limit) : null;
  const parsedOffset = Number.isInteger(offset) ? Math.max(0, offset) : null;

  let query = 'SELECT * FROM mood_entries WHERE user_id = $1';
  const params = [context.userId];

  if (startTime && endTime) {
    query += ` AND time BETWEEN $${params.length + 1} AND $${params.length + 2}`;
    params.push(startTime, endTime);
  } else if (startTime) {
    query += ` AND time >= $${params.length + 1}`;
    params.push(startTime);
  } else if (endTime) {
    query += ` AND time <= $${params.length + 1}`;
    params.push(endTime);
  }

  query += ' ORDER BY time DESC';

  if (parsedLimit !== null) {
    query += ` LIMIT $${params.length + 1}`;
    params.push(parsedLimit);
  }

  if (parsedOffset !== null) {
    query += ` OFFSET $${params.length + 1}`;
    params.push(parsedOffset);
  }

  const result = await db.query(query, params);
  return result.rows.map(mapMoodEntry);
};
