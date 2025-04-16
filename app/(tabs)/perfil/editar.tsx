import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { supabase } from '../../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../../../context/AppContext';

export default function EditarPerfil() {
  const router = useRouter();
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const [nome, setNome] = useState('Seu Nome');
  const [imagemUrl, setImagemUrl] = useState('https://cdn-icons-png.flaticon.com/512/3135/3135715.png');

  useEffect(() => {
    const carregarDados = async () => {
      const nomeLocal = await AsyncStorage.getItem('perfil_nome');
      const imagemLocal = await AsyncStorage.getItem('perfil_imagemUrl');
      if (nomeLocal) setNome(nomeLocal);
      if (imagemLocal) setImagemUrl(imagemLocal);

      const { data } = await supabase.auth.getUser();
      const nomeSalvo = data.user?.user_metadata?.full_name;
      const imagemSalva = data.user?.user_metadata?.imagemUrl;

      if (nomeSalvo) setNome(nomeSalvo);
      if (imagemSalva) setImagemUrl(imagemSalva);
    };

    carregarDados();
  }, []);

  const handleSalvar = async () => {
    // Salva localmente os dados antes de atualizar remotamente
    await AsyncStorage.setItem('perfil_nome', nome);
    await AsyncStorage.setItem('perfil_imagemUrl', imagemUrl ?? '');
  
    // Atualiza no Supabase
    const { error } = await supabase.auth.updateUser({
      data: { full_name: nome, imagemUrl },
    });
  
    if (error) {
      Toast.show({ type: 'error', text1: 'Erro!', text2: error.message });
      return;
    }
  
    // Busca os dados atualizados do usuário
    const { data: updatedUser, error: fetchError } = await supabase.auth.getUser();
    if (fetchError) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar localmente',
        text2: fetchError.message,
      });
      return;
    }
  
    const nomeAtualizado = updatedUser.user?.user_metadata?.full_name;
    const imagemAtualizada = updatedUser.user?.user_metadata?.imagemUrl;
  
    // Atualiza estados locais e persistência
    await AsyncStorage.setItem('perfil_nome', nomeAtualizado ?? '');
    await AsyncStorage.setItem('perfil_imagemUrl', imagemAtualizada ?? '');
  
    // (opcional) Atualiza os estados da tela
    setNome(nomeAtualizado ?? '');
    setImagemUrl(imagemAtualizada ?? '');
  
    // Feedback + volta para a tela de perfil
    Toast.show({ type: 'success', text1: 'Perfil atualizado!' });
    router.replace('/(tabs)/perfil');
  };
  
  const escolherImagem = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Upload de imagem não é suportado no navegador. Teste no celular.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Você precisa permitir acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const img = result.assets[0];
      const ext = img.uri.split('.').pop();

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        Alert.alert('Erro ao obter usuário');
        return;
      }

      const userId = userData.user.id;
      const fileName = `${userId}.${ext}`;
      const filePath = `${userId}/${fileName}`;

      const file = {
        uri: img.uri,
        name: fileName,
        type: img.type || 'image/jpeg',
      };

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file as any, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        Alert.alert('Erro ao enviar imagem', uploadError.message);
      } else {
        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        const imagemUrl = data.publicUrl;

        const { error: metaError } = await supabase.auth.updateUser({
          data: { imagemUrl },
        });

        if (metaError) {
          Alert.alert('Erro ao salvar imagem no perfil', metaError.message);
        } else {
          setImagemUrl(imagemUrl);
          Toast.show({ type: 'success', text1: 'Imagem atualizada' });
        }
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1e1e2e' : '#ffffff' }]}>
      <Text style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>Editar Perfil</Text>

      <TouchableOpacity style={styles.profileImageContainer} onPress={escolherImagem}>
        <Image source={{ uri: imagemUrl }} style={styles.profileImage} />
        <View style={[styles.editOverlay, { backgroundColor: isDark ? '#393956' : '#eee' }]}>
          <Text style={[styles.editIcon, { color: isDark ? '#ffffff' : '#000000' }]}>📸</Text>
        </View>
      </TouchableOpacity>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? '#2a2a3b' : '#ffffff',
            borderColor: isDark ? '#393956' : '#ccc',
            color: isDark ? '#ffffff' : '#000000',
          },
        ]}
        placeholder="Digite seu nome"
        placeholderTextColor={isDark ? '#cccccc' : '#888'}
        value={nome}
        onChangeText={setNome}
      />

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: isDark ? '#7B2CBF' : '#00B2CA' }]}
        onPress={handleSalvar}
      >
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <View style={styles.paddingtopdez} />
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: isDark ? '#555' : '#ccc' }]}
        onPress={() => router.push('/perfil')}
      >
        <Text style={[styles.saveButtonText, { color: isDark ? '#ffffff' : '#000000' }]}>Voltar para o Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  paddingtopdez: {
    paddingTop: 10,
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    padding: 6,
    borderRadius: 12,
  },
  editIcon: {
    fontSize: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
});
