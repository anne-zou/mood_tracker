import { FlatList, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { GRAY_TEXT } from '../../styles/colors';
import MessageRow from './MessageRow';
import DateSeparator from './DateSeparator';

// Type for entries with Relay fragment refs
type Entry = {
  readonly id: string;
  readonly content: string;
  readonly time: string;
  readonly " $fragmentSpreads": any;
};

type MessageListProps = {
  entries: readonly Entry[];
  emptyText: string;
  textColor: string;
  textSize: number;
  showEmptyState?: boolean;
  editingId: string | null;
  editingText: string;
  onChangeEditingText: (value: string) => void;
  onStartEdit: (entryId: string, content: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (entryId: string) => void;
  dimAll?: boolean;
};

/**
 * Normalizes a timestamp to a day-only key for grouping entries by calendar day.
 * Returns a string like "2026-0-24" representing year-month-day, ignoring time.
 * Used to determine when entries cross a day boundary and need a date separator.
 */
const getDayKey = (timestamp: string) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

export default function MessageList({
  entries,
  emptyText,
  textColor,
  textSize,
  showEmptyState = true,
  editingId,
  editingText,
  onChangeEditingText,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  dimAll = false,
}: MessageListProps) {
  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      inverted
      renderItem={({ item, index }) => {
        const nextEntry = entries[index + 1];
        // Show a date separator if this is the first entry or if the next entry is on a different day
        const showDateSeparator =
          !nextEntry || getDayKey(nextEntry.time) !== getDayKey(item.time);
        const timestamp = item.time ? new Date(item.time).getTime() : Date.now();

        return (
          <View style={styles.messageRowWrapper}>
            {showDateSeparator && (
              <DateSeparator timestamp={timestamp} dimmed={dimAll} />
            )}
            <MessageRow
              entry={item}
              textColor={textColor}
              textSize={textSize}
              editingId={editingId}
              editingText={editingText}
              onChangeEditingText={onChangeEditingText}
              onStartEdit={() => onStartEdit(item.id, item.content)}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              onDelete={() => onDelete(item.id)}
              dimAll={dimAll}
            />
          </View>
        );
      }}
      ListEmptyComponent={
        showEmptyState ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: textColor, fontSize: textSize }]}>
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
