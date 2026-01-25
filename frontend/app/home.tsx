import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { graphql, useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import { GRAY_TEXT, SCREEN_BACKGROUND, DARK_NEUTRAL, WHITE } from '../styles/colors';
import { createDimmedStyle } from '../styles/dimming';
import MainInputBar from './components/MainInputBar';
import MessageList from './components/MessageList';
import HamburgerMenu from './components/HamburgerMenu';
import EmojiSelector from './components/EmojiSelector';
import { supabase } from '../lib/supabase';
import { createMoodEntry as createMoodEntryMutation } from '../lib/relay/mutations/CreateMoodEntryMutation';
import { updateMoodEntry as updateMoodEntryMutation } from '../lib/relay/mutations/UpdateMoodEntryMutation';
import { deleteMoodEntry as deleteMoodEntryMutation } from '../lib/relay/mutations/DeleteMoodEntryMutation';
import type { homeScreenQuery } from './__generated__/homeScreenQuery.graphql';

const baseTextSize = 15;

const HomeScreenQuery = graphql`
  query homeScreenQuery($first: Int!) {
    ...home_moodEntries @arguments(first: $first)
  }
`;

const HomeScreenPaginationFragment = graphql`
  fragment home_moodEntries on Query
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 50 }
    after: { type: "String" }
  )
  @refetchable(queryName: "home_moodEntriesPaginationQuery") {
    moodEntries(first: $first, after: $after)
      @connection(key: "home_moodEntries") {
      edges {
        node {
          id
          content
          time
          ...MessageRow_entry
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

function HomeScreenContent() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingEntryText, setEditingEntryText] = useState('');
  const [isEditingEmojis, setIsEditingEmojis] = useState(false);
  const mainInputRef = useRef<any>(null);

  const queryData = useLazyLoadQuery<homeScreenQuery>(
    HomeScreenQuery,
    { first: 50 }
  );

  const { data, loadNext, hasNext } = usePaginationFragment(
    HomeScreenPaginationFragment,
    queryData
  );

  const focusMainInput = () => {
    requestAnimationFrame(() => {
      mainInputRef.current?.focus();
    });
  };

  /**
   * Check if user is authenticated and set the user ID
   */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/');
      } else {
        setUserId(session.user.id);
      }
    });

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
   * Extract entries from Relay data
   */
  const entries = (data as any).moodEntries?.edges.map((edge: any) => edge.node) || [];

  /**
   * Callback function for pressing an emoji button to enter it into the main input
   */
  const handleAddEmoji = (emoji: string) => {
    setInput((prev) => (prev ? `${prev} ${emoji}` : emoji));
    focusMainInput();
  };

  /**
   * Callback function to handle creating a new mood entry
   */
  const handleMainInputSubmit = async () => {
    const trimmed = input.trim();
    setInput('');
    focusMainInput();
    if (!trimmed || !userId) {
      return;
    }
    try {
      await createMoodEntryMutation(trimmed, new Date().toISOString());
    } catch (error) {
      console.error('Error creating mood entry:', error);
    }
  };

  /**
   * Callback function to handle starting to edit an entry
   */
  const handleStartEditEntry = (entryId: string, content: string) => {
    setEditingEntryId(entryId);
    setEditingEntryText(content);
  };

  /**
   * Callback function to handle saving an entry after editing
   */
  const handleSaveEditEntry = async () => {
    if (!editingEntryId) {
      return;
    }

    const originalEntry = entries.find((e: any) => e.id === editingEntryId);
    const trimmedText = editingEntryText.trim();

    // Don't save if content hasn't changed
    if (originalEntry && trimmedText === originalEntry.content) {
      setEditingEntryId(null);
      focusMainInput();
      return;
    }

    try {
      await updateMoodEntryMutation(editingEntryId, trimmedText, originalEntry?.time);
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

    const originalEntry = entries.find((e: any) => e.id === editingEntryId);
    setEditingEntryText(originalEntry?.content ?? '');
    setEditingEntryId(null);
    focusMainInput();
  };

  /**
   * Callback function to handle deleting an entry
   */
  const handleDeleteEntry = async (entryId: string) => {
    try {
      focusMainInput();
      await deleteMoodEntryMutation(entryId);
    } catch (error) {
      console.error('Error deleting mood entry:', error);
    }
  };

  const isEditingMoodEntry = !!editingEntryId;
  const isEditingAny = isEditingMoodEntry || isEditingEmojis;

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
            showEmptyState={entries.length === 0}
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
            onSubmit={handleMainInputSubmit}
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

export default function HomeScreen() {
  return (
    <Suspense fallback={
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={DARK_NEUTRAL} />
        </View>
      </SafeAreaView>
    }>
      <HomeScreenContent />
    </Suspense>
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
