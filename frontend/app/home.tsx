import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/client/react';
import { GRAY_TEXT, SCREEN_BACKGROUND, DARK_NEUTRAL, WHITE } from '../styles/colors';
import { createDimmedStyle } from '../styles/dimming';
import MainInputBar from './components/MainInputBar';
import MessageList, { MoodEntry } from './components/MessageList';
import HamburgerMenu from './components/HamburgerMenu';
import EmojiSelector from './components/EmojiSelector';
import { supabase } from '../lib/supabase';
import {
  QUERY_MOOD_ENTRIES,
  CREATE_MOOD_ENTRY,
  UPDATE_MOOD_ENTRY,
  DELETE_MOOD_ENTRY,
  MoodEntryResponse,
  QueryMoodEntriesResponse,
  CreateMoodEntryResponse,
  UpdateMoodEntryResponse,
  DeleteMoodEntryResponse,
} from '../lib/graphql/moodEntries';

const baseTextSize = 15;

export default function HomeScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingEntryText, setEditingEntryText] = useState('');
  const [isEditingEmojis, setIsEditingEmojis] = useState(false);
  const mainInputRef = useRef<any>(null);
  const focusMainInput = () => {
    requestAnimationFrame(() => {
      mainInputRef.current?.focus();
    });
  };

  /**
   * Check if user is authenticated and set the user ID
   */
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

  /**
   * Query the mood entries
   */
  const { data, loading, error } = useQuery<QueryMoodEntriesResponse>(QUERY_MOOD_ENTRIES, {
    variables: { limit: 100 },
    skip: !userId || typeof window === 'undefined',
    errorPolicy: 'all',
  });

  /**
   * Parse the mood entries into a list of MessageEntry objects 
   */
  const entries: MoodEntry[] = data?.queryMoodEntries?.map((entry: MoodEntryResponse) => ({
    userId: entry.userId,
    id: entry.id,
    content: entry.content,
    time: Number(entry.time),
    createdAt: Number(entry.createdAt),
    updatedAt: Number(entry.updatedAt),
  })) || [];

  /**
   * Handle errors from the query
   */
  useEffect(() => {
    if (error) {
      console.error('GraphQL Error:', error);
    }
  }, [error]);

  /**
   * Mutation to create a new mood entry
   */
  const [createMoodEntry] = useMutation<CreateMoodEntryResponse>(CREATE_MOOD_ENTRY, {
    optimisticResponse: (vars) => {
      const now = Date.now().toString();
      return {
        createMoodEntry: {
          __typename: 'MoodEntry',
          id: `temp-${now}`,
          userId: userId || '',
          content: vars.content,
          time: now,
          createdAt: now,
          updatedAt: now,
        },
      };
    },
    update(cache, { data }) {
      const newEntry = data?.createMoodEntry;
      if (!newEntry) return;

      const existing = cache.readQuery<QueryMoodEntriesResponse>({
        query: QUERY_MOOD_ENTRIES,
        variables: { limit: 100 },
      });

      if (existing?.queryMoodEntries) {
        cache.writeQuery({
          query: QUERY_MOOD_ENTRIES,
          variables: { limit: 100 },
          data: {
            queryMoodEntries: [newEntry, ...existing.queryMoodEntries],
          },
        });
      }
    },
  });

  /**
   * Mutation to update a mood entry
   */
  const [updateMoodEntry] = useMutation<UpdateMoodEntryResponse>(UPDATE_MOOD_ENTRY, {
    optimisticResponse: (vars) => {
      const entry = entries.find(e => e.id === vars.id);
      return {
        updateMoodEntry: {
          __typename: 'MoodEntry',
          id: vars.id,
          userId: userId || '',
          content: vars.content || '',
          time: entry?.time.toString() || new Date().toISOString(),
          createdAt: entry?.createdAt.toString() || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    },
  });

  /**
   * Mutation to delete a mood entry
   */
  const [deleteMoodEntry] = useMutation<DeleteMoodEntryResponse>(DELETE_MOOD_ENTRY, {
    optimisticResponse: (vars) => ({
      deleteMoodEntry: {
        __typename: 'DeleteResponse',
        deleted: true,
      },
    }),
    update(cache, { data }, { variables }) {
      if (!data?.deleteMoodEntry?.deleted || !variables?.id) return;

      const existing = cache.readQuery<QueryMoodEntriesResponse>({
        query: QUERY_MOOD_ENTRIES,
        variables: { limit: 100 },
      });

      if (existing?.queryMoodEntries) {
        cache.writeQuery({
          query: QUERY_MOOD_ENTRIES,
          variables: { limit: 100 },
          data: {
            queryMoodEntries: existing.queryMoodEntries.filter(
              (entry) => entry.id !== variables.id
            ),
          },
        });
      }
    },
  });

  /**
   * Callback function to handle creating a new mood entry
   */
  const handleSend = async () => {
    const trimmed = input.trim();
    setInput('');
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
    } catch (error) {
      console.error('Error creating mood entry:', error);
    } finally {
      focusMainInput();
    }
  };

  /**
   * Callback function to handle starting to edit an entry
   */
  const handleStartEditEntry = (entry: MoodEntry) => {
    setEditingEntryId(entry.id);
    setEditingEntryText(entry.content);
  };

  /**
   * Callback function for pressing an emoji button to enter it into the main input
   */
  const handleAddEmoji = (emoji: string) => {
    setInput((prev) => (prev ? `${prev} ${emoji}` : emoji));
  };

  /**
   * Callback function to handle saving an edited entry
   */
  const handleSaveEditEntry = async () => {
    if (!editingEntryId) {
      return;
    }

    const originalEntry = entries.find(e => e.id === editingEntryId);
    const trimmedText = editingEntryText.trim();

    // Don't save if content hasn't changed
    if (originalEntry && trimmedText === originalEntry.content) {
      setEditingEntryId(null);
      focusMainInput();
      return;
    }

    try {
      await updateMoodEntry({
        variables: {
          id: editingEntryId,
          content: trimmedText,
        },
      });
      setEditingEntryId(null);
      focusMainInput();
    } catch (error) {
      console.error('Error updating mood entry:', error);
    }
  };

  /**
   * Callback function to cancel editing an entry
   */
  const handleCancelEditEntry = () => {
    if (!editingEntryId) {
      return;
    }

    const originalEntry = entries.find(e => e.id === editingEntryId);
    setEditingEntryText(originalEntry?.content ?? '');
    setEditingEntryId(null);
    focusMainInput();
  };

  /**
   * Callback function to handle deleting an entry
   */
  const handleDeleteEntry = async (entryId: string) => {
    try {
      await deleteMoodEntry({
        variables: {
          id: entryId,
        },
      });
      focusMainInput();
    } catch (error) {
      console.error('Error deleting mood entry:', error);
    }
  };

  const isEditingMoodEntry = !!editingEntryId;
  const isEditingAny = isEditingMoodEntry || isEditingEmojis;

  if (loading && !data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DARK_NEUTRAL} />
        </View>
      </SafeAreaView>
    );
  }

  /**
   * Render the home screen
   */
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.header, isEditingAny && styles.dimmed]}>
          <HamburgerMenu />
        </View>

        <KeyboardAvoidingView
          style={styles.inner}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
          <MessageList
            entries={entries}
            emptyText="How are you feeling?"
            textColor={GRAY_TEXT}
            textSize={baseTextSize}
            editingId={editingEntryId}
            editingText={editingEntryText}
            onChangeEditingText={setEditingEntryText}
            onStartEdit={handleStartEditEntry}
            onSaveEdit={handleSaveEditEntry}
            onCancelEdit={handleCancelEditEntry}
            onDelete={handleDeleteEntry}
            dimAll={isEditingEmojis}
          />

          <MainInputBar
            ref={mainInputRef}
            value={input}
            onChangeText={setInput}
            onSubmit={handleSend}
            placeholder="Enter your mood..."
            placeholderTextColor={GRAY_TEXT}
            textSize={baseTextSize}
            backgroundColor={SCREEN_BACKGROUND}
            inputBackgroundColor={WHITE}
            inputTextColor="#1f2933"
            dimmed={isEditingAny}
          />
          <EmojiSelector
            onEmojiPress={handleAddEmoji}
            onEditingChange={setIsEditingEmojis}
            onFinishEditing={focusMainInput}
            enabled={!!userId}
            dimmed={isEditingMoodEntry}
          />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SCREEN_BACKGROUND,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 2000,
    alignSelf: 'center',
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
  dimmed: createDimmedStyle(),
});
