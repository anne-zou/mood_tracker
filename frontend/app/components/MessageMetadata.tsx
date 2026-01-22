import { View, StyleSheet } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { GRAY_TEXT } from '../../styles/colors';
import { MessageEntry } from './MessageList';

type MessageMetadataProps = {
  item: MessageEntry;
  textColor: string;
  onStartEdit: (entry: MessageEntry) => void;
  onDelete: (entryId: string) => void;
};

export default function MessageMetadata({
  item,
  textColor,
  onStartEdit,
  onDelete,
}: MessageMetadataProps) {
  return (
    <View style={styles.container}>
      <Text
        variant="bodySmall"
        numberOfLines={1}
        ellipsizeMode="clip"
        style={[styles.time, { color: textColor }]}
      >
        {new Date(item.time).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </Text>
      <View style={styles.actions}>
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
});
