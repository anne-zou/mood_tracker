import { FlatList, StyleSheet, View } from 'react-native';
import { Surface, IconButton, Text, TextInput } from 'react-native-paper';
import { GRAY_TEXT, WHITE } from '../../styles/colors';
import { RADIUS } from '../../styles/textStyles';
import { fontConfig } from '../_layout';

export type MoodEntry = {
  id: string;
  userId: string;
  content: string;
  time: number;
  createdAt: number;
  updatedAt: number;
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
              mode="outlined"
              dense
              autoFocus
              returnKeyType="done"
              onSubmitEditing={onSaveEdit}
              onBlur={onSaveEdit}
              style={styles.editingInput}
              outlineStyle={{ borderWidth: 0 }}
              theme={{
                colors: { outline: 'transparent', background: WHITE }
              }}
              contentStyle={{
                ...fontConfig,
                fontSize: textSize,
                color: textColor,
                paddingHorizontal: 14,
                paddingVertical: 10,
              }}
            />
          ) : (
              <Surface style={styles.messageBubble} elevation={0}>
              <Text style={[styles.messageText, { ...fontConfig, color: textColor, fontSize: textSize }]}>
                  {item.content}
              </Text>
              </Surface>
          )}
          <Text variant="bodySmall" style={[styles.messageTime, { color: textColor }]}>
            {new Date(item.time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </Text>
          <View style={styles.messageActions}>
            <IconButton
              icon="pencil"
              size={12}
              iconColor={textColor}
              onPress={() => onStartEdit(item)}
              style={styles.actionButton}
            />
            <IconButton
              icon="trash-can"
              size={12}
              iconColor={textColor}
              onPress={() => onDelete(item.id)}
              style={styles.actionButton}
            />
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
    backgroundColor: WHITE,
    borderRadius: RADIUS,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  editingInput: {
    maxWidth: '80%',
    minWidth: '80%',
    height: 38,
  },
  messageText: {
    color: GRAY_TEXT,
  },
  messageTime: {
    color: GRAY_TEXT,
  },
  messageActions: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  actionButton: {
    margin: 0,
    width: 28,
    height: 28,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 48,
  },
  emptyText: {
    color: GRAY_TEXT,
  },
});
