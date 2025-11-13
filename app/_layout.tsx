import { Toast, useToast } from '@/components/Toast';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";


function ToastContainer() {
  const toast = useToast();
  return toast ? <Toast visible={true} message={toast.message} type={toast.type} onHide={() => {}} /> : null;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-users" options={{ headerShown: false }} />
        <Stack.Screen name="add-products" options={{ headerShown: false }} />
        <Stack.Screen name="transactions-history" options={{ headerShown: false }} />
        <Stack.Screen name="show_users" options={{ headerShown: false }} />
        <Stack.Screen name="show_products" options={{ headerShown: false }} />
        <Stack.Screen name="adjust-products" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      <ToastContainer />
    </ThemeProvider>
  );
}
