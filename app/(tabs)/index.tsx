import { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  Platform, TouchableOpacity, Image
} from 'react-native';
import * as Location from 'expo-location';
import { supabase } from '../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function HomeMapScreen() {
  const [MapView, setMapView] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);
  const [location, setLocation] = useState(null);
  const [imagemUrl, setImagemUrl] = useState<string | null>(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      const maps = require('react-native-maps');
      setMapView(() => maps.default);
      setMarker(() => maps.Marker);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const { data } = await supabase.auth.getUser();
      const url = data.user?.user_metadata?.imagemUrl;
      const local = await AsyncStorage.getItem('perfil_imagemUrl');
      setImagemUrl(url ?? local);
    })();
  }, []);

  const voltarParaLocalAtual = async () => {
    if (!mapRef.current || !location) return;
    mapRef.current.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  const irParaCasa = () => {
    // Em breve: buscar do Supabase e navegar até as coordenadas da casa
    console.log("Ir para casa");
  };

  const irParaUniversidade = () => {
    // Em breve: buscar do Supabase e navegar até as coordenadas da universidade
    console.log("Ir para universidade");
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.centered}>
        <Text>Mapa disponível apenas em dispositivos móveis.</Text>
      </View>
    );
  }

  if (!MapView || !Marker || !location) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Card com botões: Casa e Universidade */}
      <View style={styles.cardTop}>
  <View style={styles.cardButtonGroup}>
    <TouchableOpacity style={styles.cardButton} onPress={irParaCasa}>
      <Ionicons name="home" size={24} color="#7B2CBF" />
      <Text style={styles.cardLabel}>Casa</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.cardButton} onPress={irParaUniversidade}>
      <Ionicons name="school" size={24} color="#7B2CBF" />
      <Text style={styles.cardLabel}>Universidade</Text>
    </TouchableOpacity>
  </View>
</View>
      

      {/* Mapa */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? MapView.PROVIDER_GOOGLE : undefined}
        
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
        >
          <View style={styles.avatarMarker}>
            <Image
              source={{ uri: imagemUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
              style={styles.avatarImage}
            />
          </View>
        </Marker>
      </MapView>
      {/* Botão flutuante: voltar para localização */}
      <TouchableOpacity style={styles.locateButton} onPress={voltarParaLocalAtual}>
        <Ionicons name="locate" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  centered: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  themeButton: {
    backgroundColor: '#7B2CBF',
    padding: 8,
    borderRadius: 8,
  },
  avatarMarker: {
    width: 48, height: 48, borderRadius: 24,
    overflow: 'hidden', borderWidth: 2, borderColor: '#fff',
  },
  avatarImage: {
    width: '100%', height: '100%', resizeMode: 'cover',
  },
  locateButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#7B2CBF',
    borderRadius: 24,
    padding: 12,
    elevation: 5,
  },
  cardTop: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 4,
  },
  
  cardButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  cardButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  
  cardLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#444',
  },
});
