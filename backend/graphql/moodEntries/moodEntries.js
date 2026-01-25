import { toGlobalId, fromGlobalId, mapMoodEntryToNode, encodeCursor, decodeCursor } from '../utils/globalId.js';

export const moodEntryTypeDefs = `
  # MoodEntry type implementing Relay Node interface
  type MoodEntry implements Node {
    id: ID!
    userId: ID!
    content: String!
    time: String!
    createdAt: String!
    updatedAt: String!
  }

  # Relay Connection types for pagination
  type MoodEntryEdge {
    cursor: String!
    node: MoodEntry!
  }

  type MoodEntryConnection {
    edges: [MoodEntryEdge!]!
    pageInfo: PageInfo!
  }

  # Mutation input types
  input CreateMoodEntryInput {
    content: String!
    time: String!
    clientMutationId: String
  }

  input UpdateMoodEntryInput {
    id: ID!
    content: String
    time: String
    clientMutationId: String
  }

  input DeleteMoodEntryInput {
    id: ID!
    clientMutationId: String
  }

  # Mutation payload types
  type CreateMoodEntryPayload {
    moodEntryEdge: MoodEntryEdge!
    clientMutationId: String
  }

  type UpdateMoodEntryPayload {
    moodEntry: MoodEntry!
    clientMutationId: String
  }

  type DeleteMoodEntryPayload {
    deletedId: ID!
    clientMutationId: String
  }
`;

export const moodEntryQueryFields = `
  # Relay-compliant connection query
  moodEntries(first: Int, after: String, last: Int, before: String): MoodEntryConnection!
`;

export const moodEntryMutationFields = `
  createMoodEntry(input: CreateMoodEntryInput!): CreateMoodEntryPayload!
  updateMoodEntry(input: UpdateMoodEntryInput!): UpdateMoodEntryPayload!
  deleteMoodEntry(input: DeleteMoodEntryInput!): DeleteMoodEntryPayload!
`;

export const createMoodEntryResolvers = () => ({
  createMoodEntry: (args, context) => createMoodEntry(args, context),
  updateMoodEntry: (args, context) => updateMoodEntry(args, context),
  deleteMoodEntry: (args, context) => deleteMoodEntry(args, context),
  moodEntries: (args, context) => moodEntriesConnection(args, context),
  node: (args, context) => nodeQuery(args, context),
});

const createMoodEntry = async ({ input }, context) => {
  const db = context?.db;
  if (!context?.userId) {
    throw new Error('Authentication required');
  }
  const { content, time, clientMutationId } = input;

  const result = await db.query(
    'INSERT INTO mood_entries (user_id, content, time) VALUES ($1, $2, $3) RETURNING *',
    [context.userId, content, time]
  );

  const row = result.rows[0];
  const node = mapMoodEntryToNode(row);

  return {
    moodEntryEdge: {
      cursor: encodeCursor(row.time, row.id),
      node,
    },
    clientMutationId,
  };
};

const updateMoodEntry = async ({ input }, context) => {
  const db = context?.db;
  if (!context?.userId) {
    throw new Error('Authentication required');
  }
  const { id, content, time, clientMutationId } = input;

  // Decode global ID to get local database ID
  const { type, id: localId } = fromGlobalId(id);
  if (type !== 'MoodEntry') {
    throw new Error('Invalid MoodEntry ID');
  }

  const result = await db.query(
    `
      UPDATE mood_entries
      SET
        content = COALESCE($1, content),
        time = COALESCE($2, time),
        updated_at = NOW()
      WHERE id = $3 AND user_id = $4
      RETURNING *
    `,
    [content ?? null, time ?? null, Number(localId), context.userId]
  );

  if (result.rowCount === 0) {
    throw new Error('Mood entry not found or access denied');
  }

  const node = mapMoodEntryToNode(result.rows[0]);

  return {
    moodEntry: node,
    clientMutationId,
  };
};

const deleteMoodEntry = async ({ input }, context) => {
  const db = context?.db;
  if (!context?.userId) {
    throw new Error('Authentication required');
  }
  const { id, clientMutationId } = input;

  // Decode global ID to get local database ID
  const { type, id: localId } = fromGlobalId(id);
  if (type !== 'MoodEntry') {
    throw new Error('Invalid MoodEntry ID');
  }

  const result = await db.query(
    'DELETE FROM mood_entries WHERE id = $1 AND user_id = $2 RETURNING *',
    [Number(localId), context.userId]
  );

  if (result.rowCount === 0) {
    throw new Error('Mood entry not found or access denied');
  }

  return {
    deletedId: id, // Return the global ID
    clientMutationId,
  };
};

/**
 * Relay-compliant connection query with cursor-based pagination
 */
const moodEntriesConnection = async ({ first = 50, after, last, before }, context) => {
  const db = context?.db;
  if (!context?.userId) {
    throw new Error('Authentication required');
  }

  let query = 'SELECT * FROM mood_entries WHERE user_id = $1';
  const params = [context.userId];

  // Handle cursor-based pagination
  if (after) {
    const { time, id } = decodeCursor(after);
    query += ` AND (time, id) < ($${params.length + 1}, $${params.length + 2})`;
    params.push(time, id);
  }

  if (before) {
    const { time, id } = decodeCursor(before);
    query += ` AND (time, id) > ($${params.length + 1}, $${params.length + 2})`;
    params.push(time, id);
  }

  query += ' ORDER BY time DESC, id DESC';

  // Apply limit (fetch one extra to determine hasNextPage)
  const limit = first || last || 50;
  query += ` LIMIT ${limit + 1}`;

  const result = await db.query(query, params);
  const rows = result.rows;

  // Check if there are more results
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;

  // Create edges with cursors
  const edges = items.map(row => ({
    cursor: encodeCursor(row.time, row.id),
    node: mapMoodEntryToNode(row),
  }));

  const pageInfo = {
    hasNextPage: hasMore && !!first,
    hasPreviousPage: !!after || !!before,
    startCursor: edges.length > 0 ? edges[0].cursor : null,
    endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
  };

  return { edges, pageInfo };
};

/**
 * Relay node query for fetching individual MoodEntry by global ID
 */
const nodeQuery = async ({ id: globalId }, context) => {
  const db = context?.db;
  if (!context?.userId) {
    throw new Error('Authentication required');
  }

  const { type, id } = fromGlobalId(globalId);

  if (type === 'MoodEntry') {
    const result = await db.query(
      'SELECT * FROM mood_entries WHERE id = $1 AND user_id = $2',
      [Number(id), context.userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return mapMoodEntryToNode(result.rows[0]);
  }

  return null;
};
