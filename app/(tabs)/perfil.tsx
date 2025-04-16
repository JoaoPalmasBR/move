import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useEffect, useState, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useApp } from '../../context/AppContext';
import { useFocusEffect } from '@react-navigation/native';

export default function PerfilScreen() {
  const router = useRouter();
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [nome, setNome] = useState('Seu Nome');
  const [imagemUrl, setImagemUrl] = useState('https://cdn-icons-png.flaticon.com/512/3135/3135715.png');

  useFocusEffect(
    useCallback(() => {
      const getUser = async () => {
        const nomeLocal = await AsyncStorage.getItem('perfil_nome');
        const imagemLocal = await AsyncStorage.getItem('perfil_imagemUrl');
        if (nomeLocal) setNome(nomeLocal);
        if (imagemLocal) setImagemUrl(imagemLocal);
  
        const { data } = await supabase.auth.getUser();
        const nome = data.user?.user_metadata?.full_name;
        const imagem = data.user?.user_metadata?.imagemUrl;
        setUserEmail(data.user?.email ?? null);
        setNome(nome || 'Usuário');
        if (imagem) setImagemUrl(imagem);
      };
  
      getUser();
    }, [])
  );
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    
    // ⬇️ REMOVE do armazenamento local também:
    await AsyncStorage.removeItem('last_session');
    
    await AsyncStorage.removeItem('sb-esnhnmuyfejtneboscsz-auth-token');
    
    
    Toast.show({ type: 'success', text1: 'Logout realizado' });
    router.replace('/(auth)/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1e1e2e' : '#ffffff' }]}>
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: imagemUrl }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={[styles.editIcon, { backgroundColor: isDark ? '#393956' : '#e0e0e0' }]}>
          <Text style={[styles.editText, { color: isDark ? '#eee' : '#000000' }]}>✏️</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.nameText, { color: isDark ? '#ffffff' : '#000000' }]}>{nome}</Text>
      <Text style={[styles.emailText, { color: isDark ? '#cccccc' : '#777' }]}>{userEmail || 'email@exemplo.com'}</Text>

      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: isDark ? '#7B2CBF' : '#00B2CA' }]}
        onPress={() => router.push('/(tabs)/perfil/editar')}
      >
        <Text style={styles.editButtonText}>Editar Perfil</Text>
      </TouchableOpacity>

      <View style={styles.options}>
        <ProfileOption title="Nome, Telefone e E-mail" isDark={isDark} />
        <ProfileOption title="Senha e Segurança" isDark={isDark} />
        <ProfileOption title="Pagamentos e Caronas" isDark={isDark} />
        <ProfileOption title="Histórico de Corridas" isDark={isDark} />
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={[styles.logoutText, { color: '#d11a2a' }]}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

function ProfileOption({ title, isDark }: { title: string; isDark: boolean }) {
  return (
    <TouchableOpacity style={[styles.optionRow, { borderBottomColor: isDark ? '#333' : '#eee' }]}>
      <Text style={[styles.optionText, { color: isDark ? '#eee' : '#000000' }]}>▸ {title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    padding: 4,
    borderRadius: 12,
  },
  editText: {
    fontSize: 14,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 14,
    marginBottom: 20,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 25,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  options: {
    width: '90%',
  },
  optionRow: {
    padding: 15,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 40,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
