import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Menu, IconButton, TextInput, Text, ActivityIndicator } from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/client/react';
import { MOOD_INPUT_BAR_HEIGHT, RADIUS } from './styles/textStyles';
import { GRAY_TEXT, SCREEN_BACKGROUND, DARK_NEUTRAL, WHITE } from './styles/colors';
import EmojiRow from './components/EmojiRow';
import MoodInputBar from './components/MoodInputBar';
import MoodMessageList, { MoodEntry } from './components/MoodMessageList';
import { supabase } from '../lib/supabase';
import {
  QUERY_MOOD_ENTRIES,
  CREATE_MOOD_ENTRY,
  UPDATE_MOOD_ENTRY,
  DELETE_MOOD_ENTRY,
  MoodEntryResponse,
  QueryMoodEntriesData,
} from '../lib/graphql/moodEntries';

const baseTextSize = 15;

export default function HomeScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [emojis, setEmojis] = useState(['🙂', '😩', '😠', '🥱']);
  const [isEditingEmojis, setIsEditingEmojis] = useState(false);
  const [emojiInput, setEmojiInput] = useState(emojis.join(' '));
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingEntryText, setEditingEntryText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const { data, loading, error } = useQuery<QueryMoodEntriesData>(QUERY_MOOD_ENTRIES, {
    variables: { limit: 100 },
    skip: !userId || typeof window === 'undefined',
    errorPolicy: 'all',
  });

  const [createMoodEntry] = useMutation(CREATE_MOOD_ENTRY, {
    refetchQueries: [{ query: QUERY_MOOD_ENTRIES, variables: { limit: 100 } }],
  });

  const [updateMoodEntry] = useMutation(UPDATE_MOOD_ENTRY, {
    refetchQueries: [{ query: QUERY_MOOD_ENTRIES, variables: { limit: 100 } }],
  });

  const [deleteMoodEntry] = useMutation(DELETE_MOOD_ENTRY, {
    refetchQueries: [{ query: QUERY_MOOD_ENTRIES, variables: { limit: 100 } }],
  });

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/');
      } else {
        setUserId(session.user.id);
      }
    });

    // Listen for auth state changes (e.g., sign out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/');
        setUserId(null);
      } else {
        setUserId(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const entries: MoodEntry[] = data?.queryMoodEntries?.map((entry: MoodEntryResponse) => ({
    id: entry.id,
    text: entry.content,
    createdAt: new Date(entry.time).getTime(),
  })) || [];

  useEffect(() => {
    if (error) {
      console.error('GraphQL Error:', error);
    }
  }, [error]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || !userId) {
      return;
    }
    try {
      await createMoodEntry({
        variables: {
          content: trimmed,
          time: new Date().toISOString(),
        },
      });
      setInput('');
    } catch (error) {
      console.error('Error creating mood entry:', error);
    }
  };

  const handleAddEmoji = (emoji: string) => {
    setInput((prev) => (prev ? `${prev} ${emoji}` : emoji));
  };

  const handleStartEditEntry = (entry: MoodEntry) => {
    setEditingEntryId(entry.id);
    setEditingEntryText(entry.text);
  };

  const handleSaveEditEntry = async () => {
    if (!editingEntryId) {
      return;
    }
    try {
      await updateMoodEntry({
        variables: {
          id: editingEntryId,
          content: editingEntryText.trim(),
        },
      });
      setEditingEntryId(null);
    } catch (error) {
      console.error('Error updating mood entry:', error);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await deleteMoodEntry({
        variables: {
          id: entryId,
        },
      });
    } catch (error) {
      console.error('Error deleting mood entry:', error);
    }
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

  const handleSignOut = async () => {
    setMenuVisible(false);
    await supabase.auth.signOut();
  };

  if (loading && !data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DARK_NEUTRAL} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="menu"
              size={24}
              iconColor={DARK_NEUTRAL}
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item onPress={handleSignOut} title="Sign out" leadingIcon="logout" />
        </Menu>
      </View>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <MoodMessageList
          entries={entries}
          emptyText="How are you feeling?"
          textColor={GRAY_TEXT}
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
          placeholderTextColor={GRAY_TEXT}
          textSize={baseTextSize}
          backgroundColor={SCREEN_BACKGROUND}
          inputBackgroundColor={WHITE}
          inputTextColor="#1f2933"
        />
        {isEditingEmojis ? (
          <View style={styles.emojiEditRow}>
            <Text variant="bodyMedium" style={styles.emojiEditLabel}>Edit emojis:</Text>
            <TextInput
              value={emojiInput}
              onChangeText={handleEmojiInputChange}
              mode="outlined"
              dense
              returnKeyType="done"
              onSubmitEditing={handleSaveEmojis}
              style={styles.emojiEditInput}
              outlineStyle={{ borderWidth: 0 }}
              theme={{
                roundness: RADIUS,
                colors: { outline: 'transparent', background: WHITE }
              }}
              contentStyle={{ fontSize: baseTextSize, color: '#1f2933' }}
            />
            <IconButton
              icon="check"
              size={16}
              iconColor={GRAY_TEXT}
              onPress={handleSaveEmojis}
              style={styles.emojiEditSaveButton}
            />
          </View>
        ) : (
          <EmojiRow
            emojis={emojis}
            onEmojiPress={handleAddEmoji}
              onActionPress={handleEditEmojis}
            actionIconColor={GRAY_TEXT}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SCREEN_BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    paddingTop: 8,
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
    color: GRAY_TEXT,
    paddingLeft: 12,
  },
  emojiEditInput: {
    height: MOOD_INPUT_BAR_HEIGHT,
  },
  emojiEditSaveButton: {
    margin: 0,
    width: 28,
    height: 28,
  },
});
