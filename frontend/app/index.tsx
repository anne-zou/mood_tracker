import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DARK_NEUTRAL, GRAY_TEXT, SCREEN_BACKGROUND } from './styles/colors';

export default function AuthLandingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Mood Logger</Text>
        <Text style={styles.subtitle}>Log in or create an account to get started.</Text>
        <View style={styles.actions}>
          <Link href="/auth/login" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Log in</Text>
            </Pressable>
          </Link>
          <Link href="/auth/signup" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Create account</Text>
            </Pressable>
          </Link>
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
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: GRAY_TEXT,
    marginBottom: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: GRAY_TEXT,
    marginBottom: 24,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: DARK_NEUTRAL,
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: DARK_NEUTRAL,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: DARK_NEUTRAL,
    fontSize: 16,
    fontWeight: '600',
  },
});
