import { gql } from '@apollo/client';

export interface EmojiConfigResponse {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueryEmojiConfigResponse {
  queryEmojiConfig: EmojiConfigResponse | null;
}

export interface UpsertEmojiConfigResponse {
  upsertEmojiConfig: EmojiConfigResponse;
}

export const QUERY_EMOJI_CONFIG = gql`
  query QueryEmojiConfig {
    queryEmojiConfig {
      id
      userId
      content
      createdAt
      updatedAt
    }
  }
`;

export const UPSERT_EMOJI_CONFIG = gql`
  mutation UpsertEmojiConfig($content: String!) {
    upsertEmojiConfig(content: $content) {
      id
      userId
      content
      createdAt
      updatedAt
    }
  }
`;

