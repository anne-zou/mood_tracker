import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, Alert, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Button, Text } from 'react-native-paper';
import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../lib/supabase';
import { SCREEN_BACKGROUND } from '../styles/colors';

WebBrowser.maybeCompleteAuthSession();

export default function AuthLandingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/home');
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/home');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      if (Platform.OS === 'web') {
        // For web, use direct OAuth with current window redirect
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });

        if (error) throw error;
      } else {
        // For mobile, use expo-web-browser
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'moodlogger://auth/callback',
          },
        });

        if (error) throw error;

        // Open the OAuth URL in browser
        if (data?.url) {
          const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            'moodlogger://auth/callback'
          );

          if (result.type === 'success') {
            // The auth state change listener will handle navigation
          }
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Image
          source={require('../assets/logo_vector.png')}
          style={styles.logo}
          contentFit="contain"
        />
        <View style={styles.textContainer}>
          <Text variant="titleLarge" style={styles.title}>
            Welcome to Mood Logger!
          </Text>
        </View>
        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleGoogleSignIn}
            icon="google"
            style={styles.googleButton}
            loading={loading}
            disabled={loading}
          >
            Sign in with Google
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SCREEN_BACKGROUND,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logo: {
    height: 180,
    width: 180,
    alignSelf: 'center',
    marginBottom: 32,
  },
  textContainer: {
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  body: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'column',
    gap: 12,
  },
  googleButton: {
    width: '100%',
  },
});
