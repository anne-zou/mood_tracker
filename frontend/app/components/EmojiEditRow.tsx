import emojiRegex from 'emoji-regex';
import { useRef, useState, useMemo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text, TextInput } from 'react-native-paper';
import { graphql, useFragment } from 'react-relay';
import { GRAY_TEXT, WHITE } from '../../styles/theme';
import { MOOD_INPUT_BAR_HEIGHT, RADIUS } from '../../styles/textStyles';
import { useAppContext } from '../context/AppContext';
import { upsertEmojiConfig } from '../../lib/relay/mutations/UpsertEmojiConfigMutation';
import type { EmojiEditRow_emojiConfig$key } from '../../__generated__/EmojiEditRow_emojiConfig.graphql';

const sanitizeEmojis = (value: string) => {
  return value.match(emojiRegex()) ?? [];
};

const EmojiEditRowFragment = graphql`
  fragment EmojiEditRow_emojiConfig on EmojiConfig {
    id
    userId
    content
    createdAt
    updatedAt
  }
`;

type EmojiEditRowProps = {
  emojiConfig: EmojiEditRow_emojiConfig$key | null;
};

export default function EmojiEditRow({ emojiConfig }: EmojiEditRowProps) {
  const { dispatch } = useAppContext();
  const inputRef = useRef<any>(null);

  const data = useFragment(EmojiEditRowFragment, emojiConfig);

  const initialEmojis = useMemo(() => {
    return sanitizeEmojis(data?.content ?? '').join('');
  }, [data?.content]);

  const [emojiInput, setEmojiInput] = useState(initialEmojis);

  /**
   * Focus the input when the component mounts
   */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  /**
   * Prevent user from switching focus away from the input while editing
   */
  const handleBlur = () => {
    // Immediately refocus the input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSave = async () => {
    const sanitizedEmojiInput = sanitizeEmojis(emojiInput);
    const nextContent = sanitizedEmojiInput.join('');
    dispatch({ type: 'FINISH_EDIT_EMOJIS' });
    try {
      await upsertEmojiConfig(nextContent, data);
    } catch (error) {
      console.error('Error saving emoji config:', error);
    }
  };

  const handleCancel = () => {
    setEmojiInput(initialEmojis);
    dispatch({ type: 'FINISH_EDIT_EMOJIS' });
  };

  return (
    <View style={styles.editRow}>
      <Text variant="bodyMedium" style={styles.editLabel}>Edit emojis:</Text>
      <TextInput
        ref={inputRef}
        value={emojiInput}
        onChangeText={setEmojiInput}
        mode="outlined"
        dense
        returnKeyType="done"
        onSubmitEditing={handleSave}
        style={styles.editInput}
        outlineStyle={{ borderWidth: 0 }}
        theme={{
          roundness: RADIUS,
          colors: { outline: 'transparent', background: WHITE }
        }}
        contentStyle={{ fontSize: 15, color: '#1f2933', letterSpacing: 6 }}
        onBlur={handleBlur}
      />
      <IconButton
        icon="check"
        size={16}
        iconColor={GRAY_TEXT}
        onPress={handleSave}
        style={styles.saveButton}
      />
      <IconButton
        icon="close"
        size={16}
        iconColor={GRAY_TEXT}
        onPress={handleCancel}
        style={styles.saveButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
    elevation: 1,
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
