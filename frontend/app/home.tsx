import { useEffect, Suspense } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { SCREEN_BACKGROUND, DARK_NEUTRAL } from '../styles/theme';
import { createDimmedStyle } from '../styles/dimming';
import MainInputBar from './components/MainInputBar';
import MessageList from './components/MessageList';
import HamburgerMenu from './components/HamburgerMenu';
import EmojiSelector from './components/EmojiSelector';
import { supabase } from '../lib/supabase';
import { useAppContext } from './context/AppContext';

function HomeScreenContent() {
  const router = useRouter();
  const { state, dispatch, mainInputRef } = useAppContext();

  /**
   * Check if user is authenticated and set the user ID
   */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/');
      } else {
        dispatch({ type: 'SET_USER_ID', payload: session.user.id });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/');
        dispatch({ type: 'SET_USER_ID', payload: null });
      } else {
        dispatch({ type: 'SET_USER_ID', payload: session.user.id });
      }
    });

    return () => subscription.unsubscribe();
  }, [router, dispatch]);

  const isEditingAny = !!state.editingEntryId;

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
          <MessageList />
          <MainInputBar ref={mainInputRef} />
          <EmojiSelector />
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
