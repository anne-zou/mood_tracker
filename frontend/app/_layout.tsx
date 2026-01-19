import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider, MD3LightTheme, configureFonts } from 'react-native-paper';
import { Platform } from 'react-native';
import { DARK_NEUTRAL, SCREEN_BACKGROUND } from './styles/colors';

const fontConfig = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
};

const fonts = configureFonts({
  config: {
    displayLarge: fontConfig,
    displayMedium: fontConfig,
    displaySmall: fontConfig,
    headlineLarge: fontConfig,
    headlineMedium: fontConfig,
    headlineSmall: fontConfig,
    titleLarge: fontConfig,
    titleMedium: fontConfig,
    titleSmall: fontConfig,
    bodyLarge: fontConfig,
    bodyMedium: fontConfig,
    bodySmall: fontConfig,
    labelLarge: fontConfig,
    labelMedium: fontConfig,
    labelSmall: fontConfig,
  },
});

const theme = {
  ...MD3LightTheme,
  fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: DARK_NEUTRAL,
    background: SCREEN_BACKGROUND,
    onSurface: DARK_NEUTRAL,
    onBackground: DARK_NEUTRAL,
    onSurfaceVariant: DARK_NEUTRAL,
  },
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
