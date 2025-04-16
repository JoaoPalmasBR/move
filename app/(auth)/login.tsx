import { useState, useEffect } from 'react';
import {
  View, Image, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';


export default function LoginScreen() {
  const { theme, toggleTheme } = useApp(); // 👈 usando tema
  const isDark = theme === 'dark';

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  
  const handleSubmit = async () => {
    if (!email.includes('@') || senha.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Dados inválidos',
        text2: 'Email deve ser válido e senha com no mínimo 6 caracteres.',
      });
      return;
    }

    if (isRegistering) {
      const { error } = await supabase.auth.signUp({ email, password: senha });
      if (error) {
        Toast.show({ type: 'error', text1: 'Erro', text2: error.message });
      } else {
        Toast.show({ type: 'success', text1: 'Conta criada com sucesso! Faça login.' });
        setIsRegistering(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) {
        Toast.show({ type: 'error', text1: 'Erro', text2: error.message });
      } else {
        Toast.show({ type: 'success', text1: 'Login realizado com sucesso!' });
        router.replace('/');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1e1e2e' : '#ffffff' },
      ]}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={[styles.header, { backgroundColor: isDark ? '#333' : '#7B2CBF' }]}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: isDark ? '#555' : '#a25be3' }]}>
          
          <Image
            source={require('../../assets/icon.png')}
            style={{ width: 200, height: 200, borderRadius: 0 }}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.form}>
        <View style={[styles.inputContainer, { backgroundColor: isDark ? '#2a2a3b' : '#F2F2F2' }]}>
          <Ionicons name="mail-outline" size={20} color="#999" style={styles.icon} />
          <TextInput
            placeholder="Email"
            placeholderTextColor={isDark ? '#cccccc' : '#666'}
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { color: isDark ? '#ffffff' : '#000000' }]}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: isDark ? '#2a2a3b' : '#F2F2F2' }]}>
          <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
          <TextInput
            placeholder="Senha"
            placeholderTextColor={isDark ? '#cccccc' : '#666'}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            style={[styles.input, { color: isDark ? '#ffffff' : '#000000' }]}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: isDark ? '#7B2CBF' : '#7B2CBF' }]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>{isRegistering ? 'Registrar' : 'Entrar'}</Text>
        </TouchableOpacity>

        <Text style={[styles.footerText, { color: isDark ? '#ccc' : '#999' }]}>
          {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
          <Text style={styles.link} onPress={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Entrar' : 'Cadastrar'}
          </Text>
        </Text>

        <TouchableOpacity onPress={toggleTheme} style={{ marginTop: 15 }}>
          <Text style={{ textAlign: 'center', color: isDark ? '#ccc' : '#666' }}>
            Alternar tema
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: '40%',
    borderBottomRightRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    padding: 20,
    marginTop: -40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 15,
  },
  link: {
    color: '#7B2CBF',
    fontWeight: '600',
  },
});
