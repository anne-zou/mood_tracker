import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, IconButton } from 'react-native-paper';
import { GRAY_TEXT, WHITE } from '../../styles/colors';
import { MOOD_INPUT_BAR_HEIGHT, RADIUS } from '../../styles/textStyles';
import EmojiRow from './EmojiRow';

type EmojiSelectorProps = {
  onEmojiPress: (emoji: string) => void;
};

const sanitizeEmojis = (value: string) => {
  const emojiRegex = /\p{Extended_Pictographic}/u;
  return Array.from(value).filter((char) => emojiRegex.test(char));
};

const formatEmojiInput = (value: string) => sanitizeEmojis(value).join(' ');

export default function EmojiSelector({ onEmojiPress }: EmojiSelectorProps) {
  const [emojis, setEmojis] = useState(['🙂', '😩', '😠', '🥱']);
  const [isEditingEmojis, setIsEditingEmojis] = useState(false);
  const [emojiInput, setEmojiInput] = useState(emojis.join(' '));

  const handleEditEmojis = () => {
    setEmojiInput(emojis.join(' '));
    setIsEditingEmojis(true);
  };

  const handleEmojiInputChange = (value: string) => {
    setEmojiInput(formatEmojiInput(value));
  };

  const handleSaveEmojis = () => {
    const nextEmojis = sanitizeEmojis(emojiInput);
    setEmojis(nextEmojis);
    setIsEditingEmojis(false);
  };

  if (isEditingEmojis) {
    return (
      <View style={styles.editRow}>
        <Text variant="bodyMedium" style={styles.editLabel}>Edit emojis:</Text>
        <TextInput
          value={emojiInput}
          onChangeText={handleEmojiInputChange}
          mode="outlined"
          dense
          returnKeyType="done"
          onSubmitEditing={handleSaveEmojis}
          style={styles.editInput}
          outlineStyle={{ borderWidth: 0 }}
          theme={{
            roundness: RADIUS,
            colors: { outline: 'transparent', background: WHITE }
          }}
          contentStyle={{ fontSize: 15, color: '#1f2933' }}
        />
        <IconButton
          icon="check"
          size={16}
          iconColor={GRAY_TEXT}
          onPress={handleSaveEmojis}
          style={styles.saveButton}
        />
      </View>
    );
  }

  return (
    <EmojiRow
      emojis={emojis}
      onEmojiPress={onEmojiPress}
      onActionPress={handleEditEmojis}
      actionIconColor={GRAY_TEXT}
    />
  );
}

const styles = StyleSheet.create({
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  editLabel: {
    color: GRAY_TEXT,
    paddingLeft: 12,
  },
  editInput: {
    height: MOOD_INPUT_BAR_HEIGHT,
  },
  saveButton: {
    margin: 0,
    width: 28,
    height: 28,
  },
});
