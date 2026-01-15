import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { DARK_NEUTRAL, GRAY_TEXT, SCREEN_BACKGROUND } from '../styles/colors';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleContinue = () => {
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Log in</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={GRAY_TEXT}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={GRAY_TEXT}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <Pressable style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => router.replace('/auth/signup')}>
          <Text style={styles.secondaryButtonText}>Create account</Text>
        </Pressable>
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
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: DARK_NEUTRAL,
  },
  subtitle: {
    fontSize: 16,
    color: DARK_NEUTRAL,
    marginBottom: 12,
  },
  form: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    color: GRAY_TEXT,
  },
  input: {
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1f2933',
  },
  primaryButton: {
    backgroundColor: DARK_NEUTRAL,
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
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
