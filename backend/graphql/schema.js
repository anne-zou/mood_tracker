import { buildSchema } from 'graphql';
import {
  createUserResolvers,
  userMutationFields,
  userQueryFields,
  userTypeDefs,
} from './users.js';
import {
  createMoodEntryResolvers,
  moodEntryMutationFields,
  moodEntryQueryFields,
  moodEntryTypeDefs,
} from './moodEntries.js';

export const schema = buildSchema(`
  ${userTypeDefs}
  ${moodEntryTypeDefs}

  type DeleteResponse {
    deleted: Boolean!
  }

  type Query {
    health: String!
    ${userQueryFields}
    ${moodEntryQueryFields}
  }

  type Mutation {
    ${userMutationFields}
    ${moodEntryMutationFields}
  }
`);

export const createRootResolvers = (pool) => ({
  health: () => 'ok',
  ...createUserResolvers(pool),
  ...createMoodEntryResolvers(pool),
});
