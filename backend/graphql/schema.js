import { buildSchema } from 'graphql';
import {
  createMoodEntryResolvers,
  moodEntryMutationFields,
  moodEntryQueryFields,
  moodEntryTypeDefs,
} from './moodEntries.js';
import { createUserResolvers, userMutationFields, userTypeDefs } from './users.js';

export const schema = buildSchema(`
  ${userTypeDefs}
  ${moodEntryTypeDefs}

  type DeleteResponse {
    deleted: Boolean!
  }

  type Query {
    health: String!
    ${moodEntryQueryFields}
  }

  type Mutation {
    ${userMutationFields}
    ${moodEntryMutationFields}
  }
`);

export const createRootResolvers = () => ({
  health: () => 'ok',
  ...createUserResolvers(),
  ...createMoodEntryResolvers(),
});
