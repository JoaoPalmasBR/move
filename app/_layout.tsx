// app/_layout.tsx
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../context/ThemeContext';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
