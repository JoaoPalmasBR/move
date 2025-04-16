import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const irParaPerfil = () => {
    router.push('/perfil');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>🏡 Bem-vindo ao app de caronas!</Text>

      <TouchableOpacity style={styles.botao} onPress={irParaPerfil}>
        <Text style={styles.textoBotao}>Ver Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  texto: { fontSize: 18, marginBottom: 20 },
  botao: {
    backgroundColor: '#00B2CA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  textoBotao: {
    color: 'white',
    fontWeight: 'bold',
  },
});
