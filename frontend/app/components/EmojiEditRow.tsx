import { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Text, TextInput } from 'react-native-paper';
import { GRAY_TEXT, WHITE } from '../../styles/colors';
import { MOOD_INPUT_BAR_HEIGHT, RADIUS } from '../../styles/textStyles';
import { createDimmedStyle } from '../../styles/dimming';

type EmojiEditRowProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  dimmed?: boolean;
};

export default function EmojiEditRow({
  value,
  onChangeText,
  onSave,
  onCancel,
  dimmed = false,
}: EmojiEditRowProps) {
  const inputRef = useRef<any>(null);

  const handleBlur = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <View style={[styles.editRow, dimmed && styles.dimmed]}>
      <Text variant="bodyMedium" style={styles.editLabel}>Edit emojis:</Text>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        mode="outlined"
        dense
        returnKeyType="done"
        onSubmitEditing={onSave}
        style={styles.editInput}
        outlineStyle={{ borderWidth: 0 }}
        theme={{
          roundness: RADIUS,
          colors: { outline: 'transparent', background: WHITE }
        }}
        contentStyle={{ fontSize: 15, color: '#1f2933', letterSpacing: 6 }}
        onBlur={handleBlur}
      />
      <IconButton
        icon="check"
        size={16}
        iconColor={GRAY_TEXT}
        onPress={onSave}
        style={styles.saveButton}
      />
      <IconButton
        icon="close"
        size={16}
        iconColor={GRAY_TEXT}
        onPress={onCancel}
        style={styles.saveButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
    elevation: 1,
  },
  editLabel: {
    color: GRAY_TEXT,
    paddingLeft: 12,
  },
  editInput: {
    height: MOOD_INPUT_BAR_HEIGHT,
  },
  saveButton: {
    margin: 0,
    width: 28,
    height: 28,
  },
  dimmed: createDimmedStyle(),
});
