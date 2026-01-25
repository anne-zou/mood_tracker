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

const SANITIZE_DELAY_MS = 500;

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

  const [selection, setSelection] = useState<{ start: number; end: number } | undefined>(undefined);
  const sanitizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cursorPositionRef = useRef<number>(initialEmojis.length);

  /**
   * Focus the input when the component mounts
   */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  /**
   * Auto-sanitize emoji input with debounce while preserving cursor position
   */
  useEffect(() => { // Executes on input change
    // Clear existing timeout 
    if (sanitizeTimeoutRef.current) {
      clearTimeout(sanitizeTimeoutRef.current);
    }

    // Set up new timeout to sanitize input after delay
    sanitizeTimeoutRef.current = setTimeout(() => {
      const sanitized = sanitizeEmojis(emojiInput).join('');
      if (sanitized !== emojiInput) {
        // Calculate new cursor position based on removed characters
        const originalCursorPos = cursorPositionRef.current;

        // Count valid emojis before the cursor position
        const emojisBeforeCursor = sanitizeEmojis(emojiInput.substring(0, originalCursorPos));
        const newCursorPos = emojisBeforeCursor.join('').length;

        // Update input and cursor position together
        setEmojiInput(sanitized);
        setSelection({ start: newCursorPos, end: newCursorPos });
      }
    }, SANITIZE_DELAY_MS);

    // Clean up timeout on unmount
    return () => {
      if (sanitizeTimeoutRef.current) {
        clearTimeout(sanitizeTimeoutRef.current);
      }
    };
  }, [emojiInput]);

  /**
   * Prevent user from switching focus away from the input while editing
   */
  const handleBlur = () => {
    // Immediately refocus the input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  /**
   * Save the emoji input to the database
   */
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

  /**
   * Cancel the emoji input and reset to initial state
   */
  const handleCancel = () => {
    setEmojiInput(initialEmojis);
    dispatch({ type: 'FINISH_EDIT_EMOJIS' });
  };

  /**
   * Track the cursor position on selection change
   */
  const handleSelectionChange = (event: any) => {
    cursorPositionRef.current = event.nativeEvent.selection.start;
  };

  return (
    <View style={styles.editRow}>
      <Text variant="bodyMedium" style={styles.editLabel}>Edit emojis:</Text>
      <TextInput
        ref={inputRef}
        value={emojiInput}
        onChangeText={setEmojiInput}
        onSelectionChange={handleSelectionChange}
        selection={selection}
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
