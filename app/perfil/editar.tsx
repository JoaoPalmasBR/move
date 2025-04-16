// app/perfil/editar.tsx
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image,
   Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { supabase } from '../../lib/supabase';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';

export default function EditarPerfil() {
  const router = useRouter();
  const [nome, setNome] = useState('Seu Nome');
  const [imagemUrl, setImagemUrl] = useState('https://cdn-icons-png.flaticon.com/512/3135/3135715.png');

  useEffect(() => {
    const carregarDados = async () => {
    const { data } = await supabase.auth.getUser();
    const nomeSalvo = data.user?.user_metadata?.full_name;
    const imagemSalva = data.user?.user_metadata?.imagemUrl;

    if (nomeSalvo) setNome(nomeSalvo);
    if (imagemSalva) setImagemUrl(imagemSalva);
  };

  carregarDados();
  }, []);

  const handleSalvar = async () => {
    const { data, error } = await supabase.auth.updateUser({
    data: { full_name: nome }, // em vez de "nome"
  });
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro!',
        text2: error.message
      });
    } else {
      // Aqui você poderá salvar no Supabase futuramente
      Toast.show({
        type: 'error',
        text1: 'Perfil atualizado!'
      });
      //Alert.alert('Perfil atualizado!');
      router.replace('/perfil');
    }
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
    console.log(fileName);
    const filePath = `${userId}/${fileName}`;
    console.log(filePath);

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
        setImagemUrl(imagemUrl); // atualiza no frontend
        Toast.show({
          type: 'success',
          text1: 'Imagem atualizada'
        });
        //Alert.alert('Sucesso', 'Imagem atualizada!');
      }
    }
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <TouchableOpacity style={styles.profileImageContainer} onPress={escolherImagem}>
        <Image source={{ uri: imagemUrl }} style={styles.profileImage} />
        <View style={styles.editOverlay}>
          <Text style={styles.editIcon}>📸</Text>
        </View>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite seu nome"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <View style={styles.paddingtopdez}></View>
      <TouchableOpacity style={styles.saveButton} onPress={() => router.push('/perfil')}>
        <Text style={styles.saveButtonText}>Voltar para o Perfil</Text>
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
    backgroundColor: '#fff',
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
    backgroundColor: '#eee',
    padding: 6,
    borderRadius: 12,
  },
  editIcon: {
    fontSize: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#00B2CA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
