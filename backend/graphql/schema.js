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
} from './emojiConfigs/emojiConfigs.js';

export const schema = buildSchema(`
  ${moodEntryTypeDefs}
  ${emojiConfigTypeDefs}

  type DeleteResponse {
    deleted: Boolean!
  }

  type Query {
    health: String!
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
