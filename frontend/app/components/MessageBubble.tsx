import { useRef } from 'react';
import { View, TextInput as RNTextInput, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { graphql, useFragment } from 'react-relay';
import { WHITE, GRAY_TEXT, BASE_TEXT_SIZE } from '../../styles/theme';
import { RADIUS } from '../../styles/textStyles';
import { fontConfig } from '../_layout';
import { createDimmedStyle } from '../../styles/dimming';
import { useAppContext } from '../context/AppContext';
import type { MessageBubble_entry$key } from '../../__generated__/MessageBubble_entry.graphql';
import { useDimming } from '../hooks/useDimming';

type MessageBubbleProps = {
  entry: MessageBubble_entry$key;
};

const MessageBubbleFragment = graphql`
  fragment MessageBubble_entry on MoodEntry {
    id
    content
  }
`;

export default function MessageBubble({
  entry,
}: MessageBubbleProps) {
  const { state, dispatch } = useAppContext();
  const { id: entryId, content } = useFragment(MessageBubbleFragment, entry);
  const inputRef = useRef<RNTextInput>(null);

  const isEditing = state.editingEntryId === entryId;
  const shouldDim = useDimming(entryId);

  /**
   * Prevent user from switching focus away from the input while editing
   */
  const handleBlur = () => {
    // Immediately refocus the input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const rawText = isEditing ? state.editingEntryText : content;
  // If the text ends in a newline, add a space to render the new line in the bubble
  const displayText = rawText.endsWith('\n') ? `${rawText} ` : rawText;

  return (
    <View style={styles.container}>
      {/* Message bubble displaying the entry text - 
      During edit mode, this will be mounted behind the text input to configure the size 
      of the container. The input will then match the size of the container. This synchronizes 
      the size of the bubble and text, so that they do not appear to shift position when switching 
      in and out of editing mode.
      */}
      <Surface style={[styles.bubble, shouldDim && styles.dimmed]} elevation={0}>
        <Text style={[styles.text, { ...fontConfig, fontSize: BASE_TEXT_SIZE }]}>
          {displayText}
        </Text>
      </Surface>
      {/* Message input - This will only be displayed when editing. */}
      {isEditing && (
        <RNTextInput
          ref={inputRef}
          value={state.editingEntryText}
          onChangeText={(text) => dispatch({ type: 'SET_ENTRY_TEXT', payload: text })}
          autoFocus
          selection={{ start: state.editingEntryText.length, end: state.editingEntryText.length }}
          onBlur={handleBlur}
          multiline
          scrollEnabled={false}
          style={[
            styles.input,
            {
              ...fontConfig,
              fontSize: BASE_TEXT_SIZE,
              color: GRAY_TEXT,
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
    position: 'absolute', // float on top of the bubble
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
