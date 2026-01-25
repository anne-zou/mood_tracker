import { buildSchema } from 'graphql';
import {
  createMoodEntryResolvers,
  moodEntryMutationFields,
  moodEntryQueryFields,
  moodEntryTypeDefs,
} from './moodEntries/moodEntries.js';
import {
  createEmojiConfigResolvers,
  emojiConfigMutationFields,
  emojiConfigQueryFields,
  emojiConfigTypeDefs,
  emojiConfigInputTypes,
} from './emojiConfigs/emojiConfigs.js';

export const schema = buildSchema(`
  # Relay Node interface
  interface Node {
    id: ID!
  }

  # Relay PageInfo type for pagination
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  ${moodEntryTypeDefs}
  ${emojiConfigTypeDefs}
  ${emojiConfigInputTypes}

  type DeleteResponse {
    deleted: Boolean!
  }

  type Query {
    health: String!
    # Relay node query for fetching objects by global ID
    node(id: ID!): Node
    ${moodEntryQueryFields}
    ${emojiConfigQueryFields}
  }

  type Mutation {
    ${moodEntryMutationFields}
    ${emojiConfigMutationFields}
  }
`);

export const createRootResolvers = () => ({
  health: () => 'ok',
  ...createMoodEntryResolvers(),
  ...createEmojiConfigResolvers(),
});
