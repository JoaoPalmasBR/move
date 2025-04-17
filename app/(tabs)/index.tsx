import { View, Text, Platform, ActivityIndicator, StyleSheet, Image } from 'react-native';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';

export default function HomeMapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [MapView, setMapView] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);
  const [imagemUrl, setImagemUrl] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      const map = require('react-native-maps');
      setMapView(() => map.default);
      setMarker(() => map.Marker);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização negada');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const { data } = await supabase.auth.getUser();
      const url = data.user?.user_metadata?.imagemUrl;
      const local = await AsyncStorage.getItem('perfil_imagemUrl');
      setImagemUrl(url ?? local);
    })();
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <Text style={{ fontSize: 16, color: '#444' }}>
          O mapa está disponível apenas no aplicativo mobile (Android/iOS).
        </Text>
      </View>
    );
  }

  if (!MapView || !Marker || !location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        {errorMsg && <Text style={{ color: 'red', marginTop: 10 }}>{errorMsg}</Text>}
      </View>
    );
  }

  return (
    <MapView
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
  }}>
    <View style={styles.markerContainer}>
      <Image
        source={{ uri: imagemUrl || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
        style={styles.markerImage}
      />
    </View>
  </Marker>
</MapView>

  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  markerContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#eee',
  },
  markerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
