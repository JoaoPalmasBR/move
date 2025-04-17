import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';

export default function HomeScreen() {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const irParaPerfil = () => {
    router.push('perfil');
  };

  
  return (
    <View style={styles(isDark).container}>
      <Text style={styles(isDark).texto}>🏡 Bem-vindo ao app de caronas!</Text>

      <TouchableOpacity style={styles(isDark).botao} onPress={irParaPerfil}>
        <Text style={styles(isDark).textoBotao}>Ver Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#1e1e2e' : '#fff',
    },
    texto: {
      fontSize: 18,
      marginBottom: 20,
      color: isDark ? '#fff' : '#000',
    },
    botao: {
      backgroundColor: isDark ? '#7B2CBF' : '#00B2CA',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    botaoTexto: {
      color: '#fff',
      fontWeight: 'bold',
    },
    textoBotao: {
      color: 'white',
      fontWeight: 'bold',
    },
  });