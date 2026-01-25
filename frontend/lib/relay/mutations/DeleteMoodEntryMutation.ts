import { graphql, commitMutation, ConnectionHandler } from 'react-relay';
import { RelayEnvironment } from '../environment';
import { MOOD_ENTRIES_CONNECTION } from '../connectionKeys';
import type { DeleteMoodEntryMutation as DeleteMoodEntryMutationType } from '../../../__generated__/DeleteMoodEntryMutation.graphql';

const mutation = graphql`
  mutation DeleteMoodEntryMutation($input: DeleteMoodEntryInput!) {
    deleteMoodEntry(input: $input) {
      deletedId
      clientMutationId
    }
  }
`;

export function deleteMoodEntry(id: string): Promise<DeleteMoodEntryMutationType['response']> {
  return new Promise((resolve, reject) => {
    commitMutation(RelayEnvironment, {
      mutation,
      variables: {
        input: { id },
      },
      updater: (store) => {
        const payload = store.getRootField('deleteMoodEntry');
        const deletedId = payload?.getValue('deletedId');

        if (deletedId) {
          // Remove from connection using ConnectionHandler
          const root = store.getRoot();
          const connection = ConnectionHandler.getConnection(
            root,
            MOOD_ENTRIES_CONNECTION
          );

          if (connection) {
            ConnectionHandler.deleteNode(connection, deletedId as string);
          }

          // Delete the record from the store
          store.delete(deletedId as string);
        }
      },
      optimisticUpdater: (store) => {
        // Optimistically remove from connection using ConnectionHandler
        const root = store.getRoot();
        const connection = ConnectionHandler.getConnection(
          root,
          MOOD_ENTRIES_CONNECTION
        );

        if (connection) {
          ConnectionHandler.deleteNode(connection, id);
        }

        // Optimistically delete from store
        store.delete(id);
      },
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
