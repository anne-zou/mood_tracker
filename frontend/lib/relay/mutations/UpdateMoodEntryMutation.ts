import { graphql, commitMutation } from 'react-relay';
import { RelayEnvironment } from '../environment';
import type { UpdateMoodEntryMutation as UpdateMoodEntryMutationType } from '../../../__generated__/UpdateMoodEntryMutation.graphql';

const mutation = graphql`
  mutation UpdateMoodEntryMutation($input: UpdateMoodEntryInput!) {
    updateMoodEntry(input: $input) {
      moodEntry {
        id
        content
        time
        updatedAt
      }
      clientMutationId
    }
  }
`;

export function updateMoodEntry(
  id: string,
  content?: string,
  time?: string
): Promise<UpdateMoodEntryMutationType['response']> {
  return new Promise((resolve, reject) => {
    commitMutation(RelayEnvironment, {
      mutation,
      variables: {
        input: {
          id,
          content,
          time,
        },
      },
      optimisticResponse: {
        updateMoodEntry: {
          moodEntry: {
            id,
            content: content || '',
            time,
            updatedAt: new Date().toISOString(),
          },
          clientMutationId: null,
        },
      } as any,
      onCompleted: (response: any, errors: any) => {
        if (errors) {
          reject(errors);
        } else {
          resolve(response);
        }
      },
      onError: (error: any) => reject(error),
    });
  });
}
