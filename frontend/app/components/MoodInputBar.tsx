import { StyleSheet, TextInput, View } from 'react-native';
import { INPUT_HEIGHT, INPUT_RADIUS } from '../styles/inputStyles';

type MoodInputBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder: string;
  placeholderTextColor: string;
  textSize: number;
  backgroundColor: string;
  inputBackgroundColor: string;
  inputTextColor: string;
};

export default function MoodInputBar({
  value,
  onChangeText,
  onSubmit,
  placeholder,
  placeholderTextColor,
  textSize,
  backgroundColor,
  inputBackgroundColor,
  inputTextColor,
}: MoodInputBarProps) {

  return (
    <View style={[styles.inputBar, { backgroundColor }]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        style={[
          styles.input,
          {
            fontSize: textSize,
            backgroundColor: inputBackgroundColor,
            color: inputTextColor,
          },
        ]}
        returnKeyType="send"
        onSubmitEditing={onSubmit}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  input: {
    flex: 1,
    borderRadius: INPUT_RADIUS,
    height: INPUT_HEIGHT,
    paddingHorizontal: 16,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
});
