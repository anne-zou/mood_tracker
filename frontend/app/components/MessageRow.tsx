import { View, StyleSheet } from 'react-native';
import { MoodEntry } from './MessageList';
import MessageBubble from './MessageBubble';
import MessageMetadata from './MessageMetadata';

type MessageRowProps = {
  item: MoodEntry;
  textColor: string;
  textSize: number;
  editingId: string | null;
  editingText: string;
  onChangeEditingText: (value: string) => void;
  onStartEdit: (entry: MoodEntry) => void;
  onSaveEdit: () => void;
  onDelete: (entryId: string) => void;
};

export default function MessageRow({
  item,
  textColor,
  textSize,
  editingId,
  editingText,
  onChangeEditingText,
  onStartEdit,
  onSaveEdit,
  onDelete,
}: MessageRowProps) {
  return (
    <View style={styles.messageRow}>
      <MessageBubble
        content={item.content}
        textColor={textColor}
        textSize={textSize}
        isEditing={editingId === item.id}
        editingText={editingText}
        onChangeEditingText={onChangeEditingText}
        onSaveEdit={onSaveEdit}
      />
      <MessageMetadata
        item={item}
        textColor={textColor}
        onStartEdit={onStartEdit}
        onDelete={onDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  messageRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});
