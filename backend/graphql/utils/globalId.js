import { toGlobalId as relayToGlobalId, fromGlobalId as relayFromGlobalId } from 'graphql-relay';

/**
 * Convert a type name and local ID to a Relay global ID
 * @param {string} type - The type name (e.g., 'MoodEntry', 'User')
 * @param {string|number} id - The local ID
 * @returns {string} Base64-encoded global ID
 */
export function toGlobalId(type, id) {
  return relayToGlobalId(type, String(id));
}

/**
 * Decode a Relay global ID to get the type and local ID
 * @param {string} globalId - Base64-encoded global ID
 * @returns {{type: string, id: string}} Object with type and id
 */
export function fromGlobalId(globalId) {
  return relayFromGlobalId(globalId);
}

/**
 * Map a database mood_entries row to a Relay-compliant MoodEntry node
 * @param {object} row - Database row from mood_entries table
 * @returns {object} MoodEntry node with global IDs
 */
export function mapMoodEntryToNode(row) {
  return {
    id: toGlobalId('MoodEntry', row.id),
    userId: toGlobalId('User', row.user_id),
    content: row.content,
    time: row.time.toISOString(),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

/**
 * Map a database emoji_configs row to a Relay-compliant EmojiConfig node
 * @param {object} row - Database row from emoji_configs table
 * @returns {object} EmojiConfig node with global IDs
 */
export function mapEmojiConfigToNode(row) {
  return {
    id: toGlobalId('EmojiConfig', row.id),
    userId: toGlobalId('User', row.user_id),
    content: row.content,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

/**
 * Encode a cursor for pagination
 * @param {string} time - ISO timestamp
 * @param {number} id - Entry ID
 * @returns {string} Base64-encoded cursor
 */
export function encodeCursor(time, id) {
  return Buffer.from(`${time}:${id}`).toString('base64');
}

/**
 * Decode a cursor for pagination
 * @param {string} cursor - Base64-encoded cursor
 * @returns {{time: string, id: number}} Decoded time and id
 */
export function decodeCursor(cursor) {
  const decoded = Buffer.from(cursor, 'base64').toString();
  const [time, id] = decoded.split(':');
  return { time, id: parseInt(id, 10) };
}
