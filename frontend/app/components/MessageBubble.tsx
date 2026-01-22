import { View, TextInput as RNTextInput, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { WHITE, GRAY_TEXT } from '../../styles/colors';
import { RADIUS } from '../../styles/textStyles';
import { fontConfig } from '../_layout';

type MessageBubbleProps = {
  content: string;
  textColor: string;
  textSize: number;
  isEditing: boolean;
  editingText: string;
  onChangeEditingText: (value: string) => void;
  onSaveEdit: () => void;
};

export default function MessageBubble({
  content,
  textColor,
  textSize,
  isEditing,
  editingText,
  onChangeEditingText,
  onSaveEdit,
}: MessageBubbleProps) {
  return (
    <View style={styles.container}>
      <Surface style={styles.bubble} elevation={0}>
        <Text style={[styles.text, { ...fontConfig, color: textColor, fontSize: textSize }]}>
          {isEditing ? editingText : content}
        </Text>
      </Surface>
      {isEditing && (
        <RNTextInput
          value={editingText}
          onChangeText={onChangeEditingText}
          autoFocus
          selection={{ start: editingText.length, end: editingText.length }}
          returnKeyType="done"
          onSubmitEditing={onSaveEdit}
          onBlur={onSaveEdit}
          multiline
          scrollEnabled={false}
          style={[
            styles.input,
            {
              ...fontConfig,
              fontSize: textSize,
              color: textColor,
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
  },
  text: {
    color: GRAY_TEXT,
  },
});
