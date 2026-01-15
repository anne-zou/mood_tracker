import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { INPUT_HEIGHT, INPUT_RADIUS } from './styles/inputStyles';
import EmojiRow from './components/EmojiRow';
import MoodInputBar from './components/MoodInputBar';
import MoodMessageList, { MoodEntry } from './components/MoodMessageList';

const grayText = '#7a7a7a';
const baseTextSize = 15;
const screenBackground = '#f6f5f2';

export default function HomeScreen() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [input, setInput] = useState('');
  const [emojis, setEmojis] = useState(['🙂', '😩', '😠', '🥱']);
  const [isEditingEmojis, setIsEditingEmojis] = useState(false);
  const [emojiInput, setEmojiInput] = useState(emojis.join(' '));
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingEntryText, setEditingEntryText] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }
    const now = Date.now();
    setEntries((prev) => [{ id: `${now}`, text: trimmed, createdAt: now }, ...prev]);
    setInput('');
  };

  const handleAddEmoji = (emoji: string) => {
    setInput((prev) => (prev ? `${prev} ${emoji}` : emoji));
  };

  const handleStartEditEntry = (entry: MoodEntry) => {
    setEditingEntryId(entry.id);
    setEditingEntryText(entry.text);
  };

  const handleSaveEditEntry = () => {
    if (!editingEntryId) {
      return;
    }
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === editingEntryId ? { ...entry, text: editingEntryText.trim() } : entry
      )
    );
    setEditingEntryId(null);
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
  };

  const formatEmojiInput = (value: string) => sanitizeEmojis(value).join(' ');

  const handleEditEmojis = () => {
    setEmojiInput(emojis.join(' '));
    setIsEditingEmojis(true);
  };

  const sanitizeEmojis = (value: string) => {
    const emojiRegex = /\p{Extended_Pictographic}/u;
    return Array.from(value).filter((char) => emojiRegex.test(char));
  };

  const handleEmojiInputChange = (value: string) => {
    setEmojiInput(formatEmojiInput(value));
  };

  const handleSaveEmojis = () => {
    const nextEmojis = sanitizeEmojis(emojiInput);
    setEmojis(nextEmojis);
    setIsEditingEmojis(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <MoodMessageList
          entries={entries}
          emptyText="How are you feeling?"
          textColor={grayText}
          textSize={baseTextSize}
          editingId={editingEntryId}
          editingText={editingEntryText}
          onChangeEditingText={setEditingEntryText}
          onStartEdit={handleStartEditEntry}
          onSaveEdit={handleSaveEditEntry}
          onDelete={handleDeleteEntry}
        />

        <MoodInputBar
          value={input}
          onChangeText={setInput}
          onSubmit={handleSend}
          placeholder="Enter your mood..."
          placeholderTextColor={grayText}
          textSize={baseTextSize}
          backgroundColor={screenBackground}
          inputBackgroundColor="#ffffff"
          inputTextColor="#1f2933"
        />
        {isEditingEmojis ? (
          <View style={styles.emojiEditRow}>
            <Text style={styles.emojiEditLabel}>Edit emojis:</Text>
            <TextInput
              value={emojiInput}
              onChangeText={handleEmojiInputChange}
              style={styles.emojiEditInput}
              returnKeyType="done"
              onSubmitEditing={handleSaveEmojis}
            />
            <Pressable style={styles.emojiEditSaveButton} onPress={handleSaveEmojis}>
              <Text style={styles.emojiEditSaveIcon}>✓</Text>
            </Pressable>
          </View>
        ) : (
          <EmojiRow
            emojis={emojis}
            onEmojiPress={handleAddEmoji}
            onActionPress={handleEditEmojis}
            actionIcon="✎"
            actionIconColor={grayText}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: screenBackground,
  },
  inner: {
    flex: 1,
  },
  emojiEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  emojiEditLabel: {
    fontSize: baseTextSize,
    color: grayText,
    paddingLeft: 12,
  },
  emojiEditInput: {
    flex: 1,
    height: INPUT_HEIGHT,
    borderRadius: INPUT_RADIUS,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    fontSize: baseTextSize,
    color: '#1f2933',
  },
  emojiEditSaveButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  emojiEditSaveIcon: {
    fontSize: 16,
    color: grayText,
  },
});
