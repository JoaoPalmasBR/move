// app/perfil.tsx
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

export default function PerfilScreen() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [nome, setNome] = useState('Seu Nome');
  const [imagemUrl, setImagemUrl] = useState('https://cdn-icons-png.flaticon.com/512/3135/3135715.png');

  useEffect(() => {
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
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    Toast.show({ type: 'success', text1: 'Logout realizado' });
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: imagemUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIcon}>
          <Text style={styles.editText}>✏️</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.nameText}>{nome}</Text>
      <Text style={styles.emailText}>{userEmail || 'email@exemplo.com'}</Text>

      <TouchableOpacity style={styles.editButton} onPress={() => router.push('/perfil/editar')}>
        <Text style={styles.editButtonText}>Editar Perfil</Text>
      </TouchableOpacity>
      <View style={styles.options}>
        <ProfileOption title="Nome, Telefone e E-mail" />
        <ProfileOption title="Senha e Segurança" />
        <ProfileOption title="Pagamentos e Caronas" />
        <ProfileOption title="Histórico de Corridas" />
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

function ProfileOption({ title }: { title: string }) {
  return (
    <TouchableOpacity style={styles.optionRow}>
      <Text style={styles.optionText}>▸ {title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    backgroundColor: '#fff',
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
    backgroundColor: '#e0e0e0',
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
    color: '#777',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#00B2CA',
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
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 40,
  },
  logoutText: {
    color: '#d11a2a',
    fontSize: 16,
    fontWeight: '500',
  },
});
