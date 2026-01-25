import { View, StyleSheet } from 'react-native';
import { graphql, useFragment } from 'react-relay';
import MessageBubble from './MessageBubble';
import MessageMetadata from './MessageMetadata';
import type { MessageRow_entry$key } from '../__generated__/MessageRow_entry.graphql';

type MessageRowProps = {
  entry: MessageRow_entry$key;
  textColor: string;
  textSize: number;
  editingId: string | null;
  editingText: string;
  onChangeEditingText: (value: string) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  dimAll?: boolean;
};

const MessageRowFragment = graphql`
  fragment MessageRow_entry on MoodEntry {
    id
    ...MessageBubble_entry
    ...MessageMetadata_entry
  }
`;

export default function MessageRow({
  entry,
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
  const data = useFragment(MessageRowFragment, entry);
  const isEditingThis = editingId === data.id;
  const shouldDim = dimAll || (editingId !== null && !isEditingThis);

  return (
    <View style={styles.messageRow}>
      <MessageBubble
        entry={data}
        textColor={textColor}
        textSize={textSize}
        isEditing={isEditingThis}
        editingText={editingText}
        onChangeEditingText={onChangeEditingText}
        onSaveEdit={onSaveEdit}
        dimmed={shouldDim}
      />
      <MessageMetadata
        entry={data}
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
