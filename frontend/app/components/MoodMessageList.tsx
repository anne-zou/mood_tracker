import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export type MoodEntry = {
  id: string;
  text: string;
  createdAt: number;
};

type MoodMessageListProps = {
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

export default function MoodMessageList({
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
}: MoodMessageListProps) {
  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      inverted
      renderItem={({ item }) => (
        <View style={styles.messageRow}>
          {editingId === item.id ? (
            <TextInput
              value={editingText}
              onChangeText={onChangeEditingText}
              style={[
                styles.messageBubble,
                { color: textColor, fontSize: textSize },
              ]}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={onSaveEdit}
              onBlur={onSaveEdit}
            />
          ) : (
            <View style={styles.messageBubble}>
              <Text style={[styles.messageText, { color: textColor, fontSize: textSize }]}>
                {item.text}
              </Text>
            </View>
          )}
          <Text style={[styles.messageTime, { color: textColor }]}>
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </Text>
          <View style={styles.messageActions}>
            <Pressable onPress={() => onStartEdit(item)} style={styles.actionButton}>
              <Text style={[styles.actionIcon, { color: textColor }]}>✎</Text>
            </Pressable>
            <Pressable onPress={() => onDelete(item.id)} style={styles.actionButton}>
              <Text style={[styles.actionIcon, { color: textColor }]}>✕</Text>
            </Pressable>
          </View>
        </View>
      )}
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
  },
  messageRow: {
    marginBottom: 12,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  messageText: {
    color: '#7a7a7a',
  },
  messageTime: {
    fontSize: 12,
    color: '#7a7a7a',
  },
  messageActions: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  actionButton: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  actionIcon: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 48,
  },
  emptyText: {
    color: '#7a7a7a',
  },
});
