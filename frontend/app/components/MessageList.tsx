import { FlatList, StyleSheet, View, TextInput as RNTextInput } from 'react-native';
import { Surface, IconButton, Text } from 'react-native-paper';
import { GRAY_TEXT, WHITE } from '../../styles/colors';
import { RADIUS } from '../../styles/textStyles';
import { fontConfig } from '../_layout';

export type MessageEntry = {
  id: string;
  userId: string;
  content: string;
  time: number;
  createdAt: number;
  updatedAt: number;
};

type MessageListProps = {
  entries: MessageEntry[];
  emptyText: string;
  textColor: string;
  textSize: number;
  editingId: string | null;
  editingText: string;
  onChangeEditingText: (value: string) => void;
  onStartEdit: (entry: MessageEntry) => void;
  onSaveEdit: () => void;
  onDelete: (entryId: string) => void;
};

const getDayKey = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const formatDayLabel = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

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
          <View style={styles.messageRow}>
            {showDateSeparator && (
              <View style={styles.dateSeparator}>
                <View style={styles.dateSeparatorLine} />
                <Text style={styles.dateSeparatorText}>{formatDayLabel(item.time)}</Text>
                <View style={styles.dateSeparatorLine} />
              </View>
            )}
            <View style={styles.messageBubbleWrapper}>
              <Surface style={styles.messageBubble} elevation={0}>
                <Text style={[styles.messageText, { ...fontConfig, color: textColor, fontSize: textSize }]}>
                  {editingId === item.id ? editingText : item.content}
                </Text>
              </Surface>
              {editingId === item.id && (
                <RNTextInput
                  value={editingText}
                  onChangeText={onChangeEditingText}
                  autoFocus
                  selection={{ start: editingText.length, end: editingText.length }}
                  returnKeyType="done"
                  onSubmitEditing={onSaveEdit}
                  onBlur={onSaveEdit}
                  multiline
                  scrollEnabled={false}
                  style={[
                    styles.editingInput,
                    {
                      ...fontConfig,
                      fontSize: textSize,
                      color: textColor,
                    },
                  ]}
                />
              )}
            </View>
            <View style={styles.messageMetadata}>
              <Text
                variant="bodySmall"
                numberOfLines={1}
                ellipsizeMode="clip"
                style={[styles.messageTime, { color: textColor }]}
              >
                {new Date(item.time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
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
  messageRow: {
    marginBottom: 12,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    flexWrap: 'wrap',
  },
  messageBubbleWrapper: {
    position: 'relative',
    flexShrink: 1,
  },
  messageBubble: {
    backgroundColor: WHITE,
    borderRadius: RADIUS,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  editingInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: WHITE,
    borderRadius: RADIUS,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  messageText: {
    color: GRAY_TEXT,
  },
  dateSeparator: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dateSeparatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: GRAY_TEXT,
    opacity: 0.35,
  },
  dateSeparatorText: {
    color: GRAY_TEXT,
    fontSize: 12,
  },
  messageTime: {
    color: GRAY_TEXT,
    marginRight: 8,
  },
  messageMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
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
