import { FlatList, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { GRAY_TEXT } from '../../styles/colors';
import MessageRow from './MessageRow';
import DateSeparator from './DateSeparator';

export type MoodEntry = {
  id: string;
  userId: string;
  content: string;
  time: number;
  createdAt: number;
  updatedAt: number;
};

type MessageListProps = {
  entries: MoodEntry[];
  emptyText: string;
  textColor: string;
  textSize: number;
  editingId: string | null;
  editingText: string;
  onChangeEditingText: (value: string) => void;
  onStartEdit: (entry: MoodEntry) => void;
  onSaveEdit: () => void;
  onDelete: (entryId: string) => void;
};

const getDayKey = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

export default function MessageList({
  entries,
  emptyText,
  textColor,
  textSize,
  editingId,
  editingText,
  onChangeEditingText,
  onStartEdit,
  onSaveEdit,
  onDelete,
}: MessageListProps) {
  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      inverted
      renderItem={({ item, index }) => {
        const nextEntry = entries[index + 1];
        const showDateSeparator =
          !nextEntry || getDayKey(nextEntry.time) !== getDayKey(item.time);

        return (
          <View style={styles.messageRowWrapper}>
            {showDateSeparator && <DateSeparator timestamp={item.time} />}
            <MessageRow
              item={item}
              textColor={textColor}
              textSize={textSize}
              editingId={editingId}
              editingText={editingText}
              onChangeEditingText={onChangeEditingText}
              onStartEdit={onStartEdit}
              onSaveEdit={onSaveEdit}
              onDelete={onDelete}
            />
          </View>
        );
      }}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: textColor, fontSize: textSize }]}>
            {emptyText}
          </Text>
        </View>
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
