import { View, StyleSheet } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { graphql, useFragment } from 'react-relay';
import { GRAY_TEXT } from '../../styles/theme';
import { createDimmedStyle } from '../../styles/dimming';
import type { MessageMetadata_entry$key } from '../../__generated__/MessageMetadata_entry.graphql';
import { useAppContext } from '../context/AppContext';
import { deleteMoodEntry as deleteMoodEntryMutation } from '../../lib/relay/mutations/DeleteMoodEntryMutation';
import { updateMoodEntry as updateMoodEntryMutation } from '../../lib/relay/mutations/UpdateMoodEntryMutation';

type MessageMetadataProps = {
  entry: MessageMetadata_entry$key;
};

const MessageMetadataFragment = graphql`
  fragment MessageMetadata_entry on MoodEntry {
    id
    time
    content
  }
`;

export default function MessageMetadata({
  entry,
}: MessageMetadataProps) {
  const { state, dispatch } = useAppContext();

  const data = useFragment(MessageMetadataFragment, entry);
  const { id: entryId, time: entryTime, content } = data;

  const isEditingThis = state.editingEntryId === entryId;
  const isEditingAny = state.editingEntryId !== null;
  const shouldDim = !isEditingThis && isEditingAny;

  /**
   * Handle start editing an entry
   */
  const handleStartEdit = () => {
    dispatch({ type: 'START_EDIT_ENTRY', payload: { entryId, content } });
  };

  /**
   * Handle save editing an entry
   */
  const handleSaveEdit = async () => {
    if (!isEditingThis) return;
    dispatch({ type: 'SAVE_EDIT_ENTRY' });

    // Don't call mutation if content hasn't changed
    const trimmedText = state.editingEntryText.trim();
    if (trimmedText === content) return;
    try {
      await updateMoodEntryMutation(entryId, trimmedText, entryTime);
    } catch (error) {
      console.error('Error updating mood entry:', error);
    }
  };

  /**
   * Handle cancel editing the entry
   */
  const handleCancelEdit = () => {
    if (!isEditingThis) return;
    dispatch({ type: 'CANCEL_EDIT_ENTRY', payload: { originalContent: content } });
  };

  /**
   * Handle delete the entry
   */
  const handleDelete = async () => {
    dispatch({ type: 'DELETE_ENTRY' });
    try {
      await deleteMoodEntryMutation(entryId);
    } catch (error) {
      console.error('Error deleting mood entry:', error);
    }
  };

  return (
    <View style={[styles.container, shouldDim && styles.dimmed]}>
      <Text
        variant="bodySmall"
        numberOfLines={1}
        ellipsizeMode="clip"
        style={styles.time}
      >
        {new Date(entryTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </Text>
      <View style={styles.actions}>
        {isEditingThis ? (
          <>
            <IconButton
              icon="check"
              size={12}
              iconColor={GRAY_TEXT}
              onPress={handleSaveEdit}
              style={styles.actionButton}
            />
            <IconButton
              icon="close"
              size={12}
              iconColor={GRAY_TEXT}
              onPress={handleCancelEdit}
              style={styles.actionButton}
            />
          </>
        ) : (
          <>
            <IconButton
              icon="pencil"
              size={12}
                iconColor={GRAY_TEXT}
                onPress={handleStartEdit}
              style={styles.actionButton}
            />
            <IconButton
              icon="trash-can"
              size={12}
                iconColor={GRAY_TEXT}
                onPress={handleDelete}
              style={styles.actionButton}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    color: GRAY_TEXT,
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  actionButton: {
    margin: 0,
    width: 28,
    height: 28,
  },
  dimmed: createDimmedStyle(),
});
