import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { ThemeProvider } from '../context/ThemeContext';
import { View, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';

export default function Layout() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const router = useRouter();
  const segments = useSegments();

  // Recupera e escuta a sessão
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe(); // ✅ agora está correto
    };
  }, []);

  // Redirecionamento baseado na sessão
  useEffect(() => {
    if (session === undefined) return;
    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      router.replace('/');
    }
  }, [session, segments]);

  if (session === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Slot />
        <Toast />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
