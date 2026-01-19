import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { MOOD_INPUT_BAR_HEIGHT, RADIUS } from '../styles/textStyles';

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
        mode="outlined"
        dense
        returnKeyType="send"
        onSubmitEditing={onSubmit}
        style={styles.input}
        outlineStyle={{ borderWidth: 0 }}
        theme={{
          roundness: RADIUS,
          colors: { outline: 'transparent', background: inputBackgroundColor }
        }}
        contentStyle={{
          fontSize: textSize,
          color: inputTextColor,
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
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
    height: MOOD_INPUT_BAR_HEIGHT,
  },
});
