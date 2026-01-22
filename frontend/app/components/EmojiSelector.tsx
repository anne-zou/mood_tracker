import { useEffect, useState } from 'react';
import { GRAY_TEXT } from '../../styles/colors';
import EmojiRow from './EmojiRow';
import EmojiEditRow from './EmojiEditRow';

type EmojiSelectorProps = {
  onEmojiPress: (emoji: string) => void;
  onEditingChange?: (isEditing: boolean) => void;
  dimmed?: boolean;
};

const sanitizeEmojis = (value: string) => {
  const emojiRegex = /\p{Extended_Pictographic}/u;
  return Array.from(value).filter((char) => emojiRegex.test(char));
};

const formatEmojiInput = (value: string) => sanitizeEmojis(value).join(' ');

export default function EmojiSelector({
  onEmojiPress,
  onEditingChange,
  dimmed = false,
}: EmojiSelectorProps) {
  const [emojis, setEmojis] = useState(['🙂', '😩', '😠', '🥱']);
  const [isEditingEmojis, setIsEditingEmojis] = useState(false);
  const [emojiInput, setEmojiInput] = useState(emojis.join(' '));

  useEffect(() => {
    onEditingChange?.(isEditingEmojis);
  }, [isEditingEmojis, onEditingChange]);

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

  const handleCancelEmojis = () => {
    setEmojiInput(emojis.join(' '));
    setIsEditingEmojis(false);
  };

  return isEditingEmojis ? (
    <EmojiEditRow
      value={emojiInput}
      onChangeText={handleEmojiInputChange}
      onSave={handleSaveEmojis}
      onCancel={handleCancelEmojis}
      dimmed={dimmed}
    />
  ) : (
    <EmojiRow
      emojis={emojis}
      onEmojiPress={onEmojiPress}
      onActionPress={handleEditEmojis}
      actionIconColor={GRAY_TEXT}
      dimmed={dimmed}
    />
  );
}
