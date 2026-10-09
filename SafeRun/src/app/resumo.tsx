
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { C, Header, Button, Card } from '../components/safe-run';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ResumoScreen() {
  const params = useLocalSearchParams<{
    tempo?: string;
    distancia?: string;
    passos?: string;
    latitude?: string;
    longitude?: string;
  }>();

  const tempo = params.tempo || '00:00:00';
  const distancia = params.distancia || '0.00';
  const passos = params.passos || '0';

  async function salvarHistorico() {
    try {
      const raw = await AsyncStorage.getItem('saferun-historico');
      const historico = raw ? JSON.parse(raw) : [];

      historico.unshift({
        id: `${Date.now()}`,
        data: new Date().toLocaleString('pt-BR'),
        tempo,
        distancia,
        passos,
        latitude: params.latitude || '',
        longitude: params.longitude || '',
      });

      await AsyncStorage.setItem('saferun-historico', JSON.stringify(historico));
      Alert.alert('Caminhada salva', 'O resumo foi adicionado ao histórico.', [
        { text: 'OK', onPress: () => router.replace('/') },
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a caminhada.');
    }
  }

  return (
    <View style={s.page}>
      <Header title="Resumo da caminhada" />
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.success}>
          <Ionicons name="checkmark-circle" size={52} color={C.green} />
          <Text style={s.title}>Caminhada finalizada!</Text>
        </View>

        <View style={s.stats}>
          <Card style={s.stat}>
            <Ionicons name="location" size={25} color={C.blue} />
            <Text style={s.label}>Distância</Text>
            <Text style={s.value}>{distancia} km</Text>
          </Card>
          <Card style={s.stat}>
            <Ionicons name="time-outline" size={25} color={C.blue} />
            <Text style={s.label}>Tempo</Text>
            <Text style={s.value}>{tempo}</Text>
          </Card>
        </View>

        <Card>
          <Text style={s.label}>Movimentos detectados</Text>
          <Text style={s.value}>{passos}</Text>
        </Card>

        <View style={s.map}>
          <Ionicons name="map-outline" size={60} color={C.blue} />
          <Text style={s.mapText}>
            {params.latitude && params.longitude
              ? `Última localização: ${Number(params.latitude).toFixed(4)}, ${Number(params.longitude).toFixed(4)}`
              : 'Trajeto não disponível'}
          </Text>
        </View>

        <Button title="Salvar e voltar para início" icon="home" onPress={salvarHistorico} />
        <Button title="Ver histórico" outline onPress={() => router.push('/historico')} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.white },
  content: { padding: 20 },
  success: { alignItems: 'center', marginVertical: 16 },
  title: { fontSize: 22, fontWeight: '800', color: C.dark, marginTop: 10 },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1 },
  label: { fontSize: 12, color: C.gray, marginTop: 5 },
  value: { fontSize: 18, color: C.dark, fontWeight: '800', marginTop: 5 },
  map: {
    height: 180, backgroundColor: C.light, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  mapText: { color: C.dark, textAlign: 'center', marginTop: 8, paddingHorizontal: 10 },
});