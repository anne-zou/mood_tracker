import emojiRegex from 'emoji-regex';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GRAY_TEXT } from '../../styles/colors';
import { MOOD_INPUT_BAR_HEIGHT } from '../../styles/textStyles';
import EmojiRow from './EmojiRow';
import EmojiEditRow from './EmojiEditRow';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  QUERY_EMOJI_CONFIG,
  UPSERT_EMOJI_CONFIG,
  QueryEmojiConfigResponse,
  UpsertEmojiConfigResponse,
} from '../../lib/graphql/emojiConfigs';

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

export default function EmojiSelector({
  onEmojiPress,
  onEditingChange,
  onFinishEditing,
  enabled = true,
  dimmed = false,
}: EmojiSelectorProps) {
  const [isEditingEmojis, setIsEditingEmojis] = useState(false);
  const [emojiInput, setEmojiInput] = useState('');

  const { data } = useQuery<QueryEmojiConfigResponse>(QUERY_EMOJI_CONFIG, {
    skip: !enabled || typeof window === 'undefined',
    fetchPolicy: 'cache-and-network',
  });

  const [upsertEmojiConfig] = useMutation<UpsertEmojiConfigResponse>(UPSERT_EMOJI_CONFIG);

  const emojis = useMemo(() => {
    return sanitizeEmojis(data?.queryEmojiConfig?.content ?? '');
  }, [data?.queryEmojiConfig?.content]);

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
    const now = new Date().toISOString();
    const optimisticConfig = {
      __typename: 'EmojiConfig',
      id: data?.queryEmojiConfig?.id ?? `temp-${Date.now()}`,
      userId: data?.queryEmojiConfig?.userId ?? 'temp',
      content: nextContent,
      createdAt: data?.queryEmojiConfig?.createdAt ?? now,
      updatedAt: now,
    };
    try {
      await upsertEmojiConfig({
        variables: { content: nextContent },
        optimisticResponse: {
          upsertEmojiConfig: optimisticConfig,
        },
        update: (cache, { data: mutationData }) => {
          const updated = mutationData?.upsertEmojiConfig;
          if (!updated) return;
          cache.writeQuery({
            query: QUERY_EMOJI_CONFIG,
            data: { queryEmojiConfig: updated },
          });
        },
      });
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
            hideAction={!data?.queryEmojiConfig}
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
