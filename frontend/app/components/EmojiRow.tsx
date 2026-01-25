import emojiRegex from 'emoji-regex';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { graphql, useFragment } from 'react-relay';
import { GRAY_TEXT, WHITE } from '../../styles/theme';
import { createDimmedStyle } from '../../styles/dimming';
import { MOOD_INPUT_BAR_HEIGHT } from '../../styles/textStyles';
import { useAppContext } from '../context/AppContext';
import type { EmojiRow_emojiConfig$key } from '../../__generated__/EmojiRow_emojiConfig.graphql';

const sanitizeEmojis = (value: string) => {
  return value.match(emojiRegex()) ?? [];
};

const EmojiRowFragment = graphql`
  fragment EmojiRow_emojiConfig on EmojiConfig {
    id
    content
  }
`;

type EmojiRowProps = {
  emojiConfig: EmojiRow_emojiConfig$key | null;
};

export default function EmojiRow({ emojiConfig }: EmojiRowProps) {
  const { state, dispatch } = useAppContext();

  const data = useFragment(EmojiRowFragment, emojiConfig);

  const emojis = useMemo(() => {
    return sanitizeEmojis(data?.content ?? '');
  }, [data?.content]);

  // Dim if any mood entry is being edited
  const dimmed = !!state.editingEntryId;

  const handleEmojiPress = (emoji: string) => {
    dispatch({ type: 'ADD_EMOJI_TO_MAIN_INPUT', payload: emoji });
  };

  const handleEditPress = () => {
    dispatch({ type: 'START_EDIT_EMOJIS' });
  };

  // Only show edit button if we have emoji config data
  const hideAction = !emojiConfig;

  return (
    <View style={[styles.emojiRow, dimmed && styles.dimmed]}>
      {emojis.map((emoji) => (
        <Pressable key={emoji} onPress={() => handleEmojiPress(emoji)} style={styles.emojiButton}>
          <Text style={styles.emojiText}>{emoji}</Text>
        </Pressable>
      ))}
      {!hideAction && (
        <IconButton
          icon="pencil"
          size={18}
          iconColor={GRAY_TEXT}
          onPress={handleEditPress}
          style={styles.emojiAddButton}
        />
      )}
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
