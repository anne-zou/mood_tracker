import { Pressable, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { WHITE } from '../../styles/colors';
import { createDimmedStyle } from '../../styles/dimming';
import { MOOD_INPUT_BAR_HEIGHT } from '../../styles/textStyles';

type EmojiRowProps = {
  emojis: string[];
  onEmojiPress: (emoji: string) => void;
  onActionPress: () => void;
  actionIconColor: string;
  dimmed?: boolean;
};

export default function EmojiRow({
  emojis,
  onEmojiPress,
  onActionPress,
  actionIconColor,
  dimmed = false,
}: EmojiRowProps) {
  return (
    <View style={[styles.emojiRow, dimmed && styles.dimmed]}>
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
    justifyContent: 'center',

    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
    elevation: 1,
  },
  emojiButton: {
    backgroundColor: WHITE,
    borderRadius: MOOD_INPUT_BAR_HEIGHT / 2,
    width: MOOD_INPUT_BAR_HEIGHT,
    height: MOOD_INPUT_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  emojiText: {
    fontSize: 15,
  },
  emojiAddButton: {
    backgroundColor: WHITE,
    borderRadius: MOOD_INPUT_BAR_HEIGHT / 2,
    margin: 0,
    width: MOOD_INPUT_BAR_HEIGHT,
    height: MOOD_INPUT_BAR_HEIGHT,
  },
  dimmed: createDimmedStyle(),
});
