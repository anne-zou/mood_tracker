import { graphql, commitMutation } from 'react-relay';
import { RelayEnvironment } from '../environment';
import type { UpsertEmojiConfigMutation as UpsertEmojiConfigMutationType } from '../../../__generated__/UpsertEmojiConfigMutation.graphql';

const mutation = graphql`
  mutation UpsertEmojiConfigMutation($input: UpsertEmojiConfigInput!) {
    upsertEmojiConfig(input: $input) {
      emojiConfig {
        id
        userId
        content
        createdAt
        updatedAt
      }
      clientMutationId
    }
  }
`;

type EmojiConfigData = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
} | null | undefined;

export function upsertEmojiConfig(
  content: string,
  existingConfig?: EmojiConfigData
): Promise<UpsertEmojiConfigMutationType['response']> {
  return new Promise((resolve, reject) => {
    commitMutation(RelayEnvironment, {
      mutation,
      variables: {
        input: {
          content,
        },
      },
      optimisticResponse: existingConfig ? {
        upsertEmojiConfig: {
          emojiConfig: {
            id: existingConfig.id,
            userId: existingConfig.userId,
            content,
            createdAt: existingConfig.createdAt,
            updatedAt: new Date().toISOString(),
          },
          clientMutationId: null,
        },
      } as any : undefined,
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
