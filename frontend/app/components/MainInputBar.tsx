import { forwardRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { MOOD_INPUT_BAR_HEIGHT, RADIUS } from '../../styles/textStyles';
import { createDimmedStyle } from '../../styles/dimming';
import { BASE_TEXT_SIZE, GRAY_TEXT, SCREEN_BACKGROUND, WHITE } from '../../styles/theme';
import { useAppContext } from '../context/AppContext';
import { createMoodEntry as createMoodEntryMutation } from '../../lib/relay/mutations/CreateMoodEntryMutation';

const INPUT_TEXT_COLOR = '#1f2933';

const MainInputBar = forwardRef<any, {}>(function MainInputBar(_props, ref) {
  const { state, dispatch } = useAppContext();
  const isEditingAny = !!state.editingEntryId;

  /**
   * Handle main input submit to create a new mood entry
   */
  const handleSubmit = useCallback(async () => {
    if (!state.userId) {
      console.error('User not authenticated');
    }
    dispatch({ type: 'SUBMIT_MAIN_INPUT' });

    // Don't call mutation if input is empty
    const trimmed = state.mainInput.trim();
    if (!trimmed) return;

    try {
      await createMoodEntryMutation(trimmed, new Date().toISOString());
    } catch (error) {
      console.error('Error creating mood entry:', error);
    }
  }, [dispatch, state.mainInput, state.userId]);

  return (
    <View style={[styles.inputBar, isEditingAny && styles.dimmed]}>
      <TextInput
        ref={ref}
        value={state.mainInput}
        onChangeText={(text) => dispatch({ type: 'SET_MAIN_INPUT', payload: text })}
        placeholder="Enter your mood..."
        placeholderTextColor={GRAY_TEXT}
        mode="outlined"
        dense
        returnKeyType="send"
        onSubmitEditing={handleSubmit}
        // react-native-paper single-line TextInput ignores submitBehavior;
        // Keep blurOnSubmit to prevent unfocus on submit.
        blurOnSubmit={false}
        style={styles.input}
        outlineStyle={{ borderWidth: 0 }}
        theme={{
          roundness: RADIUS,
          colors: { outline: 'transparent', background: WHITE }
        }}
        contentStyle={{
          fontSize: BASE_TEXT_SIZE,
          color: INPUT_TEXT_COLOR,
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
    backgroundColor: SCREEN_BACKGROUND
  },
  input: {
    flex: 1,
    height: MOOD_INPUT_BAR_HEIGHT,
  },
  dimmed: createDimmedStyle(),
});
