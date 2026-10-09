
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import { C, Header, Button, Card } from '../components/safe-run';

export default function CaminhadaScreen() {
  const [segundos, setSegundos] = useState(0);
  const [passos, setPassos] = useState(0);
  const [sensorAtivo, setSensorAtivo] = useState(false);
  const [distancia, setDistancia] = useState(0);
  const [posicao, setPosicao] = useState<Location.LocationObjectCoords | null>(null);
  const ultimoPasso = useRef(0);
  const pontos = useRef<Location.LocationObjectCoords[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setSegundos((v) => v + 1), 1000);
    let locationSubscription: Location.LocationSubscription | undefined;

    let accelerometerSubscription: ReturnType<typeof Accelerometer.addListener> | undefined;

    async function iniciarSensores() {
      try {
        const available = await Accelerometer.isAvailableAsync();
        setSensorAtivo(available);

        if (available) {
          Accelerometer.setUpdateInterval(250);
          accelerometerSubscription = Accelerometer.addListener((data) => {
            const magnitude = Math.sqrt(
              data.x * data.x + data.y * data.y + data.z * data.z,
            );

            const now = Date.now();
            if (magnitude > 1.35 && now - ultimoPasso.current > 450) {
              ultimoPasso.current = now;
              setPassos((v) => v + 1);
            }
          });
        }

        const permission = await Location.getForegroundPermissionsAsync();
        if (permission.status === 'granted') {
          locationSubscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.Balanced,
              distanceInterval: 5,
              timeInterval: 3000,
            },
            (location) => {
              const current = location.coords;
              const previous = pontos.current[pontos.current.length - 1];

              if (previous) {
                const rad = (v: number) => (v * Math.PI) / 180;
                const dLat = rad(current.latitude - previous.latitude);
                const dLon = rad(current.longitude - previous.longitude);
                const a =
                  Math.sin(dLat / 2) ** 2 +
                  Math.cos(rad(previous.latitude)) *
                    Math.cos(rad(current.latitude)) *
                    Math.sin(dLon / 2) ** 2;
                const meters = 6371000 * 2 * Math.atan2(
                  Math.sqrt(a), Math.sqrt(1 - a),
                );

                if (meters < 100) setDistancia((v) => v + meters);
              }

              pontos.current.push(current);
              setPosicao(current);
            },
          );
        }
      } catch {
        setSensorAtivo(false);
      }
    }

    iniciarSensores();

    return () => {
      clearInterval(timer);
      locationSubscription?.remove();
      accelerometerSubscription?.remove();
    };
  }, []);

  const tempo = `${String(Math.floor(segundos / 3600)).padStart(2, '0')}:${String(
    Math.floor((segundos % 3600) / 60),
  ).padStart(2, '0')}:${String(segundos % 60).padStart(2, '0')}`;

  function sos() {
    Alert.alert(
      'SOS',
      'Deseja iniciar o procedimento de emergência?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => Alert.alert(
            'Emergência',
            'O protótipo registrou sua confirmação, mas não enviou uma mensagem real.',
          ),
        },
      ],
    );
  }

  function finalizar() {
    router.replace({
      pathname: '/resumo',
      params: {
        tempo,
        distancia: (distancia / 1000).toFixed(2),
        passos: String(passos),
        latitude: posicao ? String(posicao.latitude) : '',
        longitude: posicao ? String(posicao.longitude) : '',
      },
    });
  }

  return (
    <View style={s.page}>
      <Header title="Caminhada em andamento" />
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.map}>
          <Ionicons name="navigate-circle" size={54} color={C.blue} />
          <Text style={s.mapTitle}>Seu trajeto</Text>
          <Text style={s.mapText}>
            {posicao
              ? `${posicao.latitude.toFixed(4)}, ${posicao.longitude.toFixed(4)}`
              : 'Aguardando localização'}
          </Text>
          <View style={s.badge}>
            <View style={[s.dot, { backgroundColor: sensorAtivo ? C.green : C.red }]} />
            <Text style={{ color: sensorAtivo ? C.green : C.red, fontSize: 12 }}>
              {sensorAtivo ? 'Sensor ativo' : 'Sensor indisponível'}
            </Text>
          </View>
        </View>

        <View style={s.stats}>
          <Card style={s.stat}>
            <Ionicons name="time-outline" size={25} color={C.blue} />
            <Text style={s.label}>Tempo</Text>
            <Text style={s.value}>{tempo}</Text>
          </Card>
          <Card style={s.stat}>
            <Ionicons name="location-outline" size={25} color={C.blue} />
            <Text style={s.label}>Distância</Text>
            <Text style={s.value}>{(distancia / 1000).toFixed(2)} km</Text>
          </Card>
        </View>

        <Card>
          <Text style={s.label}>Status do sensor</Text>
          <Text style={s.value}>
            {sensorAtivo ? 'Monitorando movimentos' : 'Use os controles manuais'}
          </Text>
          <Text style={s.label}>Movimentos detectados: {passos}</Text>
        </Card>

        <Button title="SOS" icon="alert-circle" danger onPress={sos} />
        <Button title="Simular possível queda" icon="warning-outline" outline onPress={() => router.push('/alerta-queda')} />
        <Button title="Finalizar caminhada" icon="stop-circle-outline" outline onPress={finalizar} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.white },
  content: { padding: 18 },
  map: {
    height: 220, backgroundColor: '#E5F0DF', borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  mapTitle: { color: C.dark, fontSize: 18, fontWeight: '800', marginTop: 8 },
  mapText: { color: C.gray, fontSize: 12, marginTop: 5 },
  badge: {
    position: 'absolute', top: 12, left: 12, backgroundColor: C.white,
    padding: 8, borderRadius: 20, flexDirection: 'row', gap: 7,
    alignItems: 'center',
  },
  dot: { width: 9, height: 9, borderRadius: 5 },
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1 },
  label: { color: C.gray, fontSize: 12, marginTop: 5 },
  value: { color: C.dark, fontSize: 18, fontWeight: '800', marginTop: 5 },
});