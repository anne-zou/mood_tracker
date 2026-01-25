import emojiRegex from 'emoji-regex';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { GRAY_TEXT } from '../../styles/colors';
import { MOOD_INPUT_BAR_HEIGHT } from '../../styles/textStyles';
import EmojiRow from './EmojiRow';
import EmojiEditRow from './EmojiEditRow';
import { upsertEmojiConfig } from '../../lib/relay/mutations/UpsertEmojiConfigMutation';
import type { EmojiSelectorQuery } from '../__generated__/EmojiSelectorQuery.graphql';

type EmojiSelectorProps = {
  onEmojiPress: (emoji: string) => void;
  onEditingChange?: (isEditing: boolean) => void;
  onFinishEditing?: () => void;
  enabled?: boolean;
  dimmed?: boolean;
};

const sanitizeEmojis = (value: string) => {
  return value.match(emojiRegex()) ?? [];
};

const EmojiSelectorQueryGraphQL = graphql`
  query EmojiSelectorQuery {
    emojiConfig {
      id
      userId
      content
      createdAt
      updatedAt
    }
  }
`;

export default function EmojiSelector({
  onEmojiPress,
  onEditingChange,
  onFinishEditing,
  enabled = true,
  dimmed = false,
}: EmojiSelectorProps) {
  const [isEditingEmojis, setIsEditingEmojis] = useState(false);
  const [emojiInput, setEmojiInput] = useState('');

  const data = useLazyLoadQuery<EmojiSelectorQuery>(
    EmojiSelectorQueryGraphQL,
    {},
    { fetchPolicy: 'store-and-network' }
  );

  const emojis = useMemo(() => {
    return sanitizeEmojis(data?.emojiConfig?.content ?? '');
  }, [data?.emojiConfig?.content]);

  useEffect(() => {
    onEditingChange?.(isEditingEmojis);
  }, [isEditingEmojis, onEditingChange]);

  const handleEditEmojis = () => {
    setEmojiInput(emojis.join(''));
    setIsEditingEmojis(true);
  };

  const handleEmojiInputChange = (value: string) => {
    setEmojiInput(value);
  };

  const handleSaveEmojis = async () => {
    const sanitizedEmojiInput = sanitizeEmojis(emojiInput);
    const nextContent = sanitizedEmojiInput.join('');
    setIsEditingEmojis(false);
    onFinishEditing?.();
    try {
      await upsertEmojiConfig(nextContent, data?.emojiConfig);
    } catch (error) {
      console.error('Error saving emoji config:', error);
    }
  };

  const handleCancelEmojis = () => {
    setEmojiInput(emojis.join(''));
    setIsEditingEmojis(false);
    onFinishEditing?.();
  };

  return (
    <View style={[styles.container, emojis.length === 0 && styles.emptyContainer]}>
      {isEditingEmojis ? (
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
            hideAction={!data?.emojiConfig}
          dimmed={dimmed}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
  },
  emptyContainer: {
    minHeight: MOOD_INPUT_BAR_HEIGHT + 12,
  },
});
