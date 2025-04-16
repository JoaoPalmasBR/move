// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Carrega sessão do Supabase ou fallback do AsyncStorage
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        await AsyncStorage.setItem('last_session', JSON.stringify(data.session));
      } else {
        const local = await AsyncStorage.getItem('last_session');
        if (local) setSession(JSON.parse(local));
      }
      setIsReady(true);
    };
    init();
  }, []);

  // Escuta mudanças na sessão
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        AsyncStorage.setItem('last_session', JSON.stringify(session));
      } else {
        AsyncStorage.removeItem('last_session');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Verifica status de conexão
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected && state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, isReady, isOnline }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
