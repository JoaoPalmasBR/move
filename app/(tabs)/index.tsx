import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import Toast from 'react-native-toast-message';

export default function HomeMapScreen() {
  const [location, setLocation] = useState<any>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Permissão negada para acessar localização' });
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log('Localização atual:', currentLocation);
    })();
  }, []);

  const voltarParaLocalAtual = () => {
    if (location) {
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const irParaCasa = async () => {
    console.log('Clicou no botão CASA');

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        console.log('Erro ao obter usuário:', userError);
        return Toast.show({ type: 'error', text1: 'Erro ao obter usuário' });
      }

      const userId = userData.user.id;
      console.log('UUID do usuário:', userId);

      const { data, error } = await supabase
        .from('loc_casa')
        .select('latlong')
        .eq('usuario', userId)
        .single();

      console.log('Resposta loc_casa:', data);

      if (error || !data?.latlong) {
        console.log('Erro ou latlong não encontrado:', error);
        return Toast.show({ type: 'error', text1: 'Local da casa não encontrado' });
      }

      const { lat, long } = data.latlong;
      console.log('Coordenadas casa:', lat, long);

      if (!lat || !long) {
        Toast.show({ type: 'error', text1: 'Coordenadas inválidas' });
        return;
      }

      mapRef.current?.animateToRegion({
        latitude: parseFloat(lat),
        longitude: parseFloat(long),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    } catch (err) {
      console.error('Erro inesperado ao buscar coordenadas da casa:', err);
      Toast.show({ type: 'error', text1: 'Erro inesperado' });
    }
  };

  const irParaUniversidade = async () => {
    console.log('Clicou no botão UNIVERSIDADE');

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        console.log('Erro ao obter usuário:', userError);
        return Toast.show({ type: 'error', text1: 'Erro ao obter usuário' });
      }

      const userId = userData.user.id;
      console.log('UUID do usuário:', userId);

      const { data: vinculo, error: vinculoError } = await supabase
        .from('usuario_faculdade')
        .select('facul')
        .eq('usuario', userId)
        .single();

      if (vinculoError || !vinculo?.facul) {
        console.log('Erro ao obter vínculo universidade:', vinculoError);
        return Toast.show({ type: 'error', text1: 'Vínculo com universidade não encontrado' });
      }

      const faculId = vinculo.facul;
      console.log('UUID da faculdade:', faculId);

      const { data: loc, error: locError } = await supabase
        .from('loc_facul')
        .select('latlong')
        .eq('facul', faculId)
        .single();

      if (locError || !loc?.latlong) {
        console.log('Erro ao obter local da universidade:', locError);
        return Toast.show({ type: 'error', text1: 'Local da universidade não encontrado' });
      }

      const { lat, long } = loc.latlong;
      console.log('Coordenadas universidade:', lat, long);

      if (!lat || !long) {
        return Toast.show({ type: 'error', text1: 'Coordenadas inválidas' });
      }

      mapRef.current?.animateToRegion({
        latitude: parseFloat(lat),
        longitude: parseFloat(long),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);

    } catch (err) {
      console.error('Erro inesperado ao buscar universidade:', err);
      Toast.show({ type: 'error', text1: 'Erro inesperado' });
    }
  };

  if (!location) return null;

  return (
    <View style={{ flex: 1 }}>
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
        <Marker coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }} />
      </MapView>

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

      <TouchableOpacity
        onPress={voltarParaLocalAtual}
        style={styles.locationButton}
      >
        <Ionicons name="locate" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
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
  locationButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#7B2CBF',
    padding: 12,
    borderRadius: 24,
    elevation: 5,
    zIndex: 10,
  },
});
