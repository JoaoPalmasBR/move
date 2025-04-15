import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';


export default function LoginScreen() {
    

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async () => {
    console.log("Enviando dados...");
    if (!email.includes('@') || senha.length < 6) {
      Alert.alert('Dados inválidos', 'Email deve ser válido e senha com no mínimo 6 caracteres.');
      return;
    }
  
    if (isRegistering) {
      console.log("Tentando registrar...");
      const { data, error } = await supabase.auth.signUp({ email, password: senha });
      console.log("Resposta registro:", { data, error });
  
      if (error) {
        Alert.alert('Erro ao registrar', error.message);
      } else {
        Alert.alert('Sucesso', 'Conta criada com sucesso! Faça login.');
        setIsRegistering(false);
      }
    } else {
      console.log("Tentando logar...");
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
      console.log("Resposta login:", { data, error });

      if (error) {
        Alert.alert('Erro ao logar', error.message);
      } else {
        Alert.alert('Sucesso!', 'Login efetuado');
        router.replace('/');
      }

    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Criar Conta' : 'Login'}</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} style={styles.input} />
      <TouchableOpacity
  style={{ backgroundColor: 'black', padding: 10, marginTop: 10 }}
  onPress={() => {
    console.log('Cliquei no botão!');
    handleSubmit();
  }}
>
  <Text style={{ color: 'white', textAlign: 'center' }}>
    {isRegistering ? 'Registrar' : 'Entrar'}
  </Text>
</TouchableOpacity>
      <View style={{ marginTop: 10 }}>
        <Button
          title={isRegistering ? 'Já tem conta? Entrar' : 'Criar nova conta'}
          onPress={() => setIsRegistering(!isRegistering)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 5 },
});
