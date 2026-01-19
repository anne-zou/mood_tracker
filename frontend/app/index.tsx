import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Button, Text } from 'react-native-paper';
import { SCREEN_BACKGROUND } from './styles/colors';

export default function AuthLandingScreen() {
  const router = useRouter();

  const handleGoogleSignIn = () => {
    // TODO: Implement Google SSO
    router.replace('/home');
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
