import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../../context/AppContext';

export default function CaronasScreen() {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1e1e2e' : '#fff' }]}>
      <Text style={[styles.text, { color: isDark ? '#fff' : '#000' }]}>🚗 Tela de Caronas (em construção)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18 },
});
