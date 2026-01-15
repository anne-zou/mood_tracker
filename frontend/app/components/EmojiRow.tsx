import { Pressable, StyleSheet, Text, View } from 'react-native';

type EmojiRowProps = {
  emojis: string[];
  onEmojiPress: (emoji: string) => void;
  onActionPress: () => void;
  actionIcon: string;
  actionIconColor: string;
};

export default function EmojiRow({
  emojis,
  onEmojiPress,
  onActionPress,
  actionIcon,
  actionIconColor,
}: EmojiRowProps) {
  return (
    <View style={styles.emojiRow}>
      {emojis.map((emoji) => (
        <Pressable key={emoji} onPress={() => onEmojiPress(emoji)} style={styles.emojiButton}>
          <Text style={styles.emojiText}>{emoji}</Text>
        </Pressable>
      ))}
      <Pressable style={styles.emojiAddButton} onPress={onActionPress}>
        <Text style={[styles.emojiAddText, { color: actionIconColor }]}>{actionIcon}</Text>
      </Pressable>
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
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  emojiText: {
    fontSize: 18,
  },
  emojiAddButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  emojiAddText: {
    fontSize: 18,
    transform: [{ rotate: '90deg' }],
  },
});
