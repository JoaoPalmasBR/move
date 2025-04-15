// app/index.tsx
import { View, Text, Button, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen() {
  const { theme, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, theme === 'dark' ? styles.dark : styles.light]}>
      <Text style={styles.text}>🏡 Tela inicial do app de caronas!</Text>
      <Text style={styles.text}>Tema atual: {theme}</Text>
      <Button title="Alternar Tema" onPress={toggleTheme} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  light: {
    backgroundColor: '#fff',
  },
  dark: {
    backgroundColor: '#111',
  },
  text: {
    color: '#4CAF50',
    fontSize: 18,
    marginBottom: 10,
  },
});
