
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import { C, Header, Button, Card } from '../components/safe-run';

export default function PermissoesScreen() {
  const [localizacao, setLocalizacao] = useState('Não verificada');
  const [sensor, setSensor] = useState('Não verificado');
  const [carregando, setCarregando] = useState(false);

  async function solicitar() {
    setCarregando(true);

    try {
      const result = await Location.requestForegroundPermissionsAsync();
      setLocalizacao(result.status === 'granted' ? 'Autorizada' : 'Negada');

      const available = await Accelerometer.isAvailableAsync();
      setSensor(available ? 'Disponível' : 'Indisponível');

      if (result.status === 'granted') {
        router.push('/caminhada');
      } else {
        Alert.alert(
          'Permissão negada',
          'Você pode tentar novamente ou continuar com funções limitadas.',
        );
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível verificar as permissões.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={s.page}>
      <Header title="Permissões" />
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.icon}>
          <Ionicons name="shield-checkmark" size={36} color={C.white} />
        </View>

        <Text style={s.title}>Permissões necessárias</Text>
        <Text style={s.description}>
          O SafeRun precisa de algumas permissões para funcionar corretamente.
        </Text>

        {[
          { icon: 'location' as const, title: 'Localização', desc: 'Registrar o trajeto', status: localizacao },
          { icon: 'speedometer' as const, title: 'Acelerômetro', desc: 'Detectar movimentos', status: sensor },
          { icon: 'notifications' as const, title: 'Notificações', desc: 'Alertas de emergência', status: 'Não configuradas' },
        ].map((item) => (
          <Card key={item.title}>
            <View style={s.row}>
              <Ionicons name={item.icon} size={27} color={C.blue} />
              <View style={s.info}>
                <Text style={s.itemTitle}>{item.title}</Text>
                <Text style={s.itemDesc}>{item.desc}</Text>
                <Text style={s.status}>{item.status}</Text>
              </View>
            </View>
          </Card>
        ))}

        <Button
          title={carregando ? 'Verificando...' : 'Conceder permissões'}
          onPress={solicitar}
        />
        <Button
          title="Tentar novamente"
          outline
          onPress={solicitar}
        />
        <Button
          title="Continuar com funções limitadas"
          outline
          onPress={() => router.push('/caminhada')}
        />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.white },
  content: { padding: 20 },
  icon: {
    width: 65, height: 65, borderRadius: 35, backgroundColor: C.blue,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
    marginBottom: 15,
  },
  title: {
    color: C.dark, fontSize: 22, fontWeight: '800', textAlign: 'center',
  },
  description: {
    color: C.gray, textAlign: 'center', lineHeight: 21,
    marginTop: 10, marginBottom: 18,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  info: { flex: 1 },
  itemTitle: { color: C.dark, fontWeight: '700', fontSize: 15 },
  itemDesc: { color: C.gray, fontSize: 12, marginTop: 4 },
  status: { color: C.blue, fontSize: 12, marginTop: 5 },
});