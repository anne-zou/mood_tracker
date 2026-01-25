import { View, StyleSheet } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { graphql, useFragment } from 'react-relay';
import { GRAY_TEXT } from '../../styles/colors';
import { createDimmedStyle } from '../../styles/dimming';
import type { MessageMetadata_entry$key } from '../__generated__/MessageMetadata_entry.graphql';

type MessageMetadataProps = {
  entry: MessageMetadata_entry$key;
  textColor: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  dimmed?: boolean;
};

const MessageMetadataFragment = graphql`
  fragment MessageMetadata_entry on MoodEntry {
    id
    time
  }
`;

export default function MessageMetadata({
  entry,
  textColor,
  isEditing,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  dimmed = false,
}: MessageMetadataProps) {
  const { time: moodEntryTime } = useFragment(MessageMetadataFragment, entry);
  return (
    <View style={[styles.container, dimmed && styles.dimmed]}>
      <Text
        variant="bodySmall"
        numberOfLines={1}
        ellipsizeMode="clip"
        style={[styles.time, { color: textColor }]}
      >
        {new Date(moodEntryTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </Text>
      <View style={styles.actions}>
        {isEditing ? (
          <>
            <IconButton
              icon="check"
              size={12}
              iconColor={textColor}
              onPress={onSaveEdit}
              style={styles.actionButton}
            />
            <IconButton
              icon="close"
              size={12}
              iconColor={textColor}
              onPress={onCancelEdit}
              style={styles.actionButton}
            />
          </>
        ) : (
          <>
            <IconButton
              icon="pencil"
              size={12}
              iconColor={textColor}
                onPress={onStartEdit}
              style={styles.actionButton}
            />
            <IconButton
              icon="trash-can"
              size={12}
              iconColor={textColor}
                onPress={onDelete}
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
