import { View, StyleSheet } from 'react-native';
import { graphql, useFragment } from 'react-relay';
import MessageBubble from './MessageBubble';
import MessageMetadata from './MessageMetadata';
import type { MessageRow_entry$key } from '../../__generated__/MessageRow_entry.graphql';

type MessageRowProps = {
  entry: MessageRow_entry$key;
};

const MessageRowFragment = graphql`
  fragment MessageRow_entry on MoodEntry {
    id
    ...MessageBubble_entry
    ...MessageMetadata_entry
  }
`;

export default function MessageRow({
  entry,
}: MessageRowProps) {
  const data = useFragment(MessageRowFragment, entry);

  return (
    <View style={styles.messageRow}>
      <MessageBubble entry={data} />
      <MessageMetadata entry={data} />
    </View>
  );
}

const styles = StyleSheet.create({
  messageRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});
