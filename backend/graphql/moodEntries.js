const requirePool = (pool) => {
  if (!pool) {
    throw new Error('Database not configured');
  }
};

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
  moodEntries(userId: ID!, startTime: String, endTime: String, limit: Int, offset: Int): [MoodEntry!]!
  moodEntry(id: ID!): MoodEntry
`;

export const moodEntryMutationFields = `
  createMoodEntry(userId: ID!, content: String!, time: String!): MoodEntry!
  updateMoodEntry(id: ID!, content: String, time: String): MoodEntry!
  deleteMoodEntry(id: ID!): DeleteResponse!
`;

export const createMoodEntryResolvers = (pool) => ({
  moodEntries: async ({ userId, startTime, endTime, limit, offset}) => {
    requirePool(pool);
    if (!userId) {
      throw new Error('userId is required');
    }
    if (startTime && endTime) {
      if (startTime > endTime) {
        throw new Error('startTime must be before endTime');
      }
    }
    const parsedLimit = Number.isInteger(limit) ? Math.max(0, limit) : null;
    const parsedOffset = Number.isInteger(offset) ? Math.max(0, offset) : null;

    let query = 'SELECT * FROM mood_entries WHERE user_id = $1';
    const params = [Number(userId)];

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

    const result = await pool.query(query, params);
    return result.rows.map(mapMoodEntry);
  },
  moodEntry: async ({ id }) => {
    requirePool(pool);
    const result = await pool.query('SELECT * FROM mood_entries WHERE id = $1', [
      Number(id),
    ]);
    if (result.rowCount === 0) {
      return null;
    }
    return mapMoodEntry(result.rows[0]);
  },
  createMoodEntry: async ({ userId, content, time }) => {
    requirePool(pool);
    const result = await pool.query(
      'INSERT INTO mood_entries (user_id, content, time) VALUES ($1, $2, $3) RETURNING *',
      [Number(userId), content, time]
    );
    return mapMoodEntry(result.rows[0]);
  },
  updateMoodEntry: async ({ id, content, time }) => {
    requirePool(pool);
    const result = await pool.query(
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
  },
  deleteMoodEntry: async ({ id }) => {
    requirePool(pool);
    const result = await pool.query(
      'DELETE FROM mood_entries WHERE id = $1 RETURNING *',
      [Number(id)]
    );

    if (result.rowCount === 0) {
      throw new Error('Mood entry not found');
    }

    return { deleted: true };
  },
});
