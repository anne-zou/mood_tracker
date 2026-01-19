import { gql } from '@apollo/client';

export interface MoodEntryResponse {
  id: string;
  userId: string;
  content: string;
  time: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueryMoodEntriesResponse {
  queryMoodEntries: MoodEntryResponse[];
}

export interface CreateMoodEntryResponse {
  createMoodEntry: MoodEntryResponse;
}

export interface UpdateMoodEntryResponse {
  updateMoodEntry: MoodEntryResponse;
}

export interface DeleteMoodEntryResponse {
  deleteMoodEntry: {
    deleted: boolean;
  };
}

export const QUERY_MOOD_ENTRIES = gql`
  query QueryMoodEntries($startTime: String, $endTime: String, $limit: Int, $offset: Int) {
    queryMoodEntries(startTime: $startTime, endTime: $endTime, limit: $limit, offset: $offset) {
      id
      userId
      content
      time
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_MOOD_ENTRY = gql`
  mutation CreateMoodEntry($content: String!, $time: String!) {
    createMoodEntry(content: $content, time: $time) {
      id
      userId
      content
      time
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_MOOD_ENTRY = gql`
  mutation UpdateMoodEntry($id: ID!, $content: String, $time: String) {
    updateMoodEntry(id: $id, content: $content, time: $time) {
      id
      userId
      content
      time
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_MOOD_ENTRY = gql`
  mutation DeleteMoodEntry($id: ID!) {
    deleteMoodEntry(id: $id) {
      deleted
    }
  }
`;
