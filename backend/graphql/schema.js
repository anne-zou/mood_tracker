import { buildSchema } from 'graphql';
import {
  createMoodEntryResolvers,
  moodEntryMutationFields,
  moodEntryQueryFields,
  moodEntryTypeDefs,
} from './moodEntries.js';

export const schema = buildSchema(`
  ${moodEntryTypeDefs}

  type DeleteResponse {
    deleted: Boolean!
  }

  type Query {
    health: String!
    ${moodEntryQueryFields}
  }

  type Mutation {
    ${moodEntryMutationFields}
  }
`);

export const createRootResolvers = (db) => ({
  health: () => 'ok',
  ...createMoodEntryResolvers(db),
});
