import { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { MOOD_INPUT_BAR_HEIGHT, RADIUS } from '../../styles/textStyles';
import { createDimmedStyle } from '../../styles/dimming';

type MainInputBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder: string;
  placeholderTextColor: string;
  textSize: number;
  backgroundColor: string;
  inputBackgroundColor: string;
  inputTextColor: string;
  dimmed?: boolean;
};

const MainInputBar = forwardRef<any, MainInputBarProps>(function MainInputBar({
  value,
  onChangeText,
  onSubmit,
  placeholder,
  placeholderTextColor,
  textSize,
  backgroundColor,
  inputBackgroundColor,
  inputTextColor,
  dimmed = false,
}, ref) {
  return (
    <View style={[styles.inputBar, { backgroundColor }, dimmed && styles.dimmed]}>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        mode="outlined"
        dense
        returnKeyType="send"
        onSubmitEditing={onSubmit}
        // react-native-paper single-line TextInput ignores submitBehavior;
        // Keep blurOnSubmit to prevent unfocus on submit.
        blurOnSubmit={false}
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
});

export default MainInputBar;

const styles = StyleSheet.create({
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    elevation: 1,
  },
  input: {
    flex: 1,
    height: MOOD_INPUT_BAR_HEIGHT,
  },
  dimmed: createDimmedStyle(),
});
