import { Pressable, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { WHITE } from '../styles/colors';
import { RADIUS } from '../styles/textStyles';

type EmojiRowProps = {
  emojis: string[];
  onEmojiPress: (emoji: string) => void;
  onActionPress: () => void;
  actionIconColor: string;
};

export default function EmojiRow({
  emojis,
  onEmojiPress,
  onActionPress,
  actionIconColor,
}: EmojiRowProps) {
  return (
    <View style={styles.emojiRow}>
      {emojis.map((emoji) => (
        <Pressable key={emoji} onPress={() => onEmojiPress(emoji)} style={styles.emojiButton}>
          <Text style={styles.emojiText}>{emoji}</Text>
        </Pressable>
      ))}
      <IconButton
        icon="pencil"
        size={18}
        iconColor={actionIconColor}
        onPress={onActionPress}
        style={styles.emojiAddButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  emojiButton: {
    backgroundColor: WHITE,
    borderRadius: RADIUS,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  emojiText: {
    fontSize: 18,
  },
  emojiAddButton: {
    backgroundColor: WHITE,
    borderRadius: 16,
    margin: 0,
    width: 40,
    height: 30,
  },
});
