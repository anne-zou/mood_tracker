import { FlatList, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { graphql, useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import { GRAY_TEXT, BASE_TEXT_SIZE } from '../../styles/theme';
import MessageRow from './MessageRow';
import DateSeparator from './DateSeparator';
import type { MessageListQuery } from '../../__generated__/MessageListQuery.graphql';

const MessageListQueryDef = graphql`
  query MessageListQuery($first: Int!) {
    ...MessageList_moodEntries @arguments(first: $first)
  }
`;

const MessageListPaginationFragment = graphql`
  fragment MessageList_moodEntries on Query
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 50 }
    after: { type: "String" }
  )
  @refetchable(queryName: "MessageList_moodEntriesPaginationQuery") {
    moodEntries(first: $first, after: $after)
      @connection(key: "MessageList_moodEntries") {
      edges {
        node {
          id
          content
          time
          ...MessageRow_entry
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/**
 * Normalizes a timestamp to a day-only key for grouping entries by calendar day.
 * Returns a string like "2026-0-24" representing year-month-day, ignoring time.
 * Used to determine when entries cross a day boundary and need a date separator.
 */
const getDayKey = (timestamp: string) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

export default function MessageList() {
  const queryData = useLazyLoadQuery<MessageListQuery>(
    MessageListQueryDef,
    { first: 50 }
  );

  const { data } = usePaginationFragment(
    MessageListPaginationFragment,
    queryData
  );

  /**
   * Extract entries from Relay data
   */
  const entries = (data as any).moodEntries?.edges.map((edge: any) => edge.node) || [];
  const showEmptyState = entries.length === 0;
  const emptyText = "How are you feeling?";

  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      inverted
      renderItem={({ item, index }) => {
        const nextEntry = entries[index + 1];
        // Show a date separator if this is the first entry or if the next entry is on a different day
        const shouldShowDateSeparator =
          !nextEntry || getDayKey(nextEntry.time) !== getDayKey(item.time);
        const timestamp = item.time ? new Date(item.time).getTime() : Date.now();

        return (
          <View style={styles.messageRowWrapper}>
            {shouldShowDateSeparator && (
              <DateSeparator timestamp={timestamp} />
            )}
            <MessageRow entry={item} />
          </View>
        );
      }}
      ListEmptyComponent={
        showEmptyState ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { fontSize: BASE_TEXT_SIZE }]}>
              {emptyText}
            </Text>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    width: '100%',
  },
  messageRowWrapper: {
    width: '100%',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 48,
  },
  emptyText: {
    color: GRAY_TEXT,
  },
});
