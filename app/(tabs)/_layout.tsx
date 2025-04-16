import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

export default function TabsLayout() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#1e1e2e' : '#fff',
          borderTopColor: isDark ? '#393956' : '#ccc',
        },
        tabBarActiveTintColor: '#7B2CBF',
        tabBarInactiveTintColor: isDark ? '#ccc' : '#666',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="caronas"
        options={{
          title: 'Caronas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil/editar"
        options={{
          tabBarItemStyle: { display: 'none' }, // Remove o link para evitar navegação
          title: 'Editar Perfil',
          //tabBarButton: () => null, // Oculta o item da barra de navegação
        }}
      />

    </Tabs>
  );
}
