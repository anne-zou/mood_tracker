import { useState, useEffect } from 'react';
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
import MainInputBar from './components/MainInputBar';
import MessageList, { MessageEntry } from './components/MessageList';
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

  const { data, loading, error } = useQuery<QueryMoodEntriesResponse>(QUERY_MOOD_ENTRIES, {
    variables: { limit: 100 },
    skip: !userId || typeof window === 'undefined',
    errorPolicy: 'all',
  });

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

  const entries: MessageEntry[] = data?.queryMoodEntries?.map((entry: MoodEntryResponse) => ({
    userId: entry.userId,
    id: entry.id,
    content: entry.content,
    time: Number(entry.time),
    createdAt: Number(entry.createdAt),
    updatedAt: Number(entry.updatedAt),
  })) || [];

  useEffect(() => {
    if (error) {
      console.error('GraphQL Error:', error);
    }
  }, [error]);

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
    }
  };

  const handleAddEmoji = (emoji: string) => {
    setInput((prev) => (prev ? `${prev} ${emoji}` : emoji));
  };

  const handleStartEditEntry = (entry: MessageEntry) => {
    setEditingEntryId(entry.id);
    setEditingEntryText(entry.content);
  };

  const handleSaveEditEntry = async () => {
    if (!editingEntryId) {
      return;
    }

    const originalEntry = entries.find(e => e.id === editingEntryId);
    const trimmedText = editingEntryText.trim();

    // Don't save if content hasn't changed
    if (originalEntry && trimmedText === originalEntry.content) {
      setEditingEntryId(null);
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
          onDelete={handleDeleteEntry}
        />

        <MainInputBar
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
        <EmojiSelector onEmojiPress={handleAddEmoji} />
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
});
