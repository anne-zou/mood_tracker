import { StyleSheet, View } from 'react-native';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { MOOD_INPUT_BAR_HEIGHT } from '../../styles/textStyles';
import EmojiRow from './EmojiRow';
import EmojiEditRow from './EmojiEditRow';
import type { EmojiSelectorQuery } from '../../__generated__/EmojiSelectorQuery.graphql';
import { useAppContext } from '../context/AppContext';
import { EDITING_EMOJI_SELECTOR_ID } from '../reducers/appReducer';

const EmojiSelectorQueryGraphQL = graphql`
  query EmojiSelectorQuery {
    emojiConfig {
      id
      content
      ...EmojiRow_emojiConfig
      ...EmojiEditRow_emojiConfig
    }
  }
`;

export default function EmojiSelector() {
  const { state } = useAppContext();

  const data = useLazyLoadQuery<EmojiSelectorQuery>(
    EmojiSelectorQueryGraphQL,
    {},
    { fetchPolicy: 'store-and-network' }
  );

  const isEditingEmojis = state.editingEntryId === EDITING_EMOJI_SELECTOR_ID;
  const isEmpty = !data?.emojiConfig?.content;

  return (
    <View style={[styles.container, isEmpty && styles.emptyContainer]}>
      {isEditingEmojis ? (
        <EmojiEditRow emojiConfig={data?.emojiConfig ?? null} />
      ) : (
        <EmojiRow emojiConfig={data?.emojiConfig ?? null} />
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
