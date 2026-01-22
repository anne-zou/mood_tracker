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
  onCancelEdit: () => void;
  onDelete: (entryId: string) => void;
  dimAll?: boolean;
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
  onCancelEdit,
  onDelete,
  dimAll = false,
}: MessageRowProps) {
  const isEditingThis = editingId === item.id;
  const shouldDim = dimAll || (editingId !== null && !isEditingThis);

  return (
    <View style={styles.messageRow}>
      <MessageBubble
        content={item.content}
        textColor={textColor}
        textSize={textSize}
        isEditing={isEditingThis}
        editingText={editingText}
        onChangeEditingText={onChangeEditingText}
        onSaveEdit={onSaveEdit}
        dimmed={shouldDim}
      />
      <MessageMetadata
        item={item}
        textColor={textColor}
        isEditing={isEditingThis}
        onStartEdit={onStartEdit}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
        onDelete={onDelete}
        dimmed={shouldDim}
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
