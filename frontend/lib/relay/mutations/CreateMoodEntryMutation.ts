import { graphql, commitMutation, ConnectionHandler } from 'react-relay';
import { RelayEnvironment } from '../environment';
import type { CreateMoodEntryMutation as CreateMoodEntryMutationType } from '../../../__generated__/CreateMoodEntryMutation.graphql';

const mutation = graphql`
  mutation CreateMoodEntryMutation($input: CreateMoodEntryInput!) {
    createMoodEntry(input: $input) {
      moodEntryEdge {
        cursor
        node {
          id
          content
          time
          createdAt
          updatedAt
        }
      }
      clientMutationId
    }
  }
`;

export function createMoodEntry(
  content: string,
  time: string
): Promise<CreateMoodEntryMutationType['response']> {
  return new Promise((resolve, reject) => {
    commitMutation(RelayEnvironment, {
      mutation,
      variables: {
        input: {
          content,
          time,
        },
      },
      updater: (store) => {
        const payload = store.getRootField('createMoodEntry');
        const edge = payload?.getLinkedRecord('moodEntryEdge');

        if (!edge) return;

        // Get the connection using ConnectionHandler
        const root = store.getRoot();
        const connection = ConnectionHandler.getConnection(
          root,
          'home_moodEntries'
        );

        if (connection) {
          // Insert the new edge at the beginning of the connection
          ConnectionHandler.insertEdgeBefore(connection, edge);
        }
      },
      optimisticUpdater: (store) => {
        // Create optimistic response
        const tempId = `temp-${Date.now()}`;
        const optimisticNode = store.create(tempId, 'MoodEntry');
        optimisticNode.setValue(tempId, 'id');
        optimisticNode.setValue(content, 'content');
        optimisticNode.setValue(time, 'time');
        optimisticNode.setValue(new Date().toISOString(), 'createdAt');
        optimisticNode.setValue(new Date().toISOString(), 'updatedAt');

        const optimisticEdge = store.create(`${tempId}-edge`, 'MoodEntryEdge');
        optimisticEdge.setLinkedRecord(optimisticNode, 'node');
        optimisticEdge.setValue('optimistic-cursor', 'cursor');

        // Get the connection using ConnectionHandler
        const root = store.getRoot();
        const connection = ConnectionHandler.getConnection(
          root,
          'home_moodEntries'
        );

        if (connection) {
          // Insert the optimistic edge at the beginning of the connection
          ConnectionHandler.insertEdgeBefore(connection, optimisticEdge);
        }
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
