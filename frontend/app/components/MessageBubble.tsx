import { useRef } from 'react';
import { View, TextInput as RNTextInput, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { graphql, useFragment } from 'react-relay';
import { WHITE, GRAY_TEXT } from '../../styles/colors';
import { RADIUS } from '../../styles/textStyles';
import { fontConfig } from '../_layout';
import { createDimmedStyle } from '../../styles/dimming';
import type { MessageBubble_entry$key } from '../__generated__/MessageBubble_entry.graphql';

type MessageBubbleProps = {
  entry: MessageBubble_entry$key;
  textColor: string;
  textSize: number;
  isEditing: boolean;
  editingText: string;
  onChangeEditingText: (value: string) => void;
  onSaveEdit: () => void;
  dimmed?: boolean;
};

const MessageBubbleFragment = graphql`
  fragment MessageBubble_entry on MoodEntry {
    id
    content
  }
`;

export default function MessageBubble({
  entry,
  textColor,
  textSize,
  isEditing,
  editingText,
  onChangeEditingText,
  onSaveEdit,
  dimmed = false,
}: MessageBubbleProps) {
  const { content: moodEntryContent } = useFragment(MessageBubbleFragment, entry);
  const inputRef = useRef<RNTextInput>(null);

  /**
   * Do not allow user to switch focus away from the message input without saving
   */
  const handleBlur = () => {
    // Immediately refocus the input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const rawText = isEditing ? editingText : moodEntryContent;
  // If the text ends in a newline, add a space to render the new line in the bubble
  const displayText = rawText.endsWith('\n') ? `${rawText} ` : rawText;

  return (
    <View style={styles.container}>
      <Surface style={[styles.bubble, dimmed && styles.dimmed]} elevation={0}>
        <Text style={[styles.text, { ...fontConfig, color: textColor, fontSize: textSize }]}>
          {displayText}
        </Text>
      </Surface>
      {isEditing && (
        <RNTextInput
          ref={inputRef}
          value={editingText}
          onChangeText={onChangeEditingText}
          autoFocus
          selection={{ start: editingText.length, end: editingText.length }}
          returnKeyType="done"
          onSubmitEditing={onSaveEdit}
          onBlur={handleBlur}
          multiline
          scrollEnabled={false}
          style={[
            styles.input,
            {
              ...fontConfig,
              fontSize: textSize,
              color: textColor,
              backgroundColor: WHITE,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexShrink: 1,
  },
  bubble: {
    backgroundColor: WHITE,
    borderRadius: RADIUS,
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 1,
  },
  input: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: WHITE,
    borderRadius: RADIUS,
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 0,
    outlineWidth: 0,
  },
  text: {
    color: GRAY_TEXT,
  },
  dimmed: createDimmedStyle(),
});
