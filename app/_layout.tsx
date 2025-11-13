import { Toast, useToast } from '@/components/Toast';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";

import { useColorScheme } from '@/hooks/useColorScheme';

function ToastContainer() {
  const toast = useToast();
  return toast ? <Toast visible={true} message={toast.message} type={toast.type} onHide={() => {}} /> : null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-users" options={{ headerShown: false }} />
        <Stack.Screen name="add-products" options={{ headerShown: false }} />
        <Stack.Screen name="transactions-history" options={{ headerShown: false }} />
        <Stack.Screen name="show_users" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      <ToastContainer />
    </ThemeProvider>
  );
}
