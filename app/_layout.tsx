import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { ThemeProvider } from '../context/ThemeContext';
import { View, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider, useAuth } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';

function RootLayout() {
  return (
    <AuthProvider>
      <AppProvider>
        <LayoutContent />
      </AppProvider>
    </AuthProvider>
  );
}

function LayoutContent() {
  const { isReady } = useAuth();

  if (!isReady) {
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

export default RootLayout;
