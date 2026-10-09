
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import { C, Header, Card, Button, BottomNav } from '../components/safe-run';

export default function ConfiguracoesScreen() {
  const [sensorIndisponivel, setSensorIndisponivel] = useState(false);

  async function verificarSensor() {
    const disponivel = await Accelerometer.isAvailableAsync();
    setSensorIndisponivel(!disponivel);

    Alert.alert(
      'Status do acelerômetro',
      disponivel ? 'O acelerômetro está disponível.' : 'O acelerômetro não está disponível neste dispositivo.',
    );
  }

  async function verificarLocalizacao() {
    const resultado = await Location.getForegroundPermissionsAsync();
    Alert.alert(
      'Permissão de localização',
      resultado.status === 'granted'
        ? 'A localização está autorizada.'
        : 'A localização não está autorizada.',
      [
        { text: 'Fechar', style: 'cancel' },
        {
          text: 'Solicitar novamente',
          onPress: () => router.push('/permissoes'),
        },
      ],
    );
  }

  return (
    <View style={s.page}>
      <Header title="Configurações" />
      <ScrollView contentContainerStyle={s.content}>
        <Card>
          <View style={s.row}>
            <Ionicons name="person-circle-outline" size={32} color={C.blue} />
            <View style={s.info}>
              <Text style={s.title}>Contato de emergência</Text>
              <Text style={s.description}>Cadastrar ou alterar contato</Text>
            </View>
          </View>
          <Button
            title="Configurar contato"
            outline
            onPress={() => router.push('/contato')}
          />
        </Card>

        <Card>
          <View style={s.row}>
            <Ionicons name="shield-checkmark-outline" size={30} color={C.blue} />
            <View style={s.info}>
              <Text style={s.title}>Permissões</Text>
              <Text style={s.description}>Localização e acesso aos recursos</Text>
            </View>
          </View>
          <Button title="Ver permissões" outline onPress={verificarLocalizacao} />
        </Card>

        <Card>
          <View style={s.row}>
            <Ionicons name="speedometer-outline" size={30} color={C.blue} />
            <View style={s.info}>
              <Text style={s.title}>Sensores</Text>
              <Text style={s.description}>
                {sensorIndisponivel ? 'Sensor indisponível' : 'Verificar estado do acelerômetro'}
              </Text>
            </View>
          </View>
          <Button title="Verificar sensor" outline onPress={verificarSensor} />
        </Card>

        <Card>
          <Text style={s.title}>Testes do protótipo</Text>
          <Text style={s.description}>
            Os botões abaixo simulam situações de erro para testar a interface.
          </Text>
          <Button
            title="Simular permissão negada"
            icon="lock-closed-outline"
            outline
            onPress={() => Alert.alert(
              'Permissão negada',
              'Este é um estado de demonstração. A permissão real do dispositivo não foi alterada.',
            )}
          />
          <Button
            title="Simular sensor indisponível"
            icon="warning-outline"
            danger
            onPress={() => {
              setSensorIndisponivel(true);
              Alert.alert(
                'Sensor indisponível',
                'A detecção automática está indisponível nesta simulação. Use os controles manuais.',
              );
            }}
          />
        </Card>
      </ScrollView>
      <BottomNav active="configuracoes" />
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.white },
  content: { padding: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  info: { flex: 1 },
  title: { color: C.dark, fontWeight: '800', fontSize: 15 },
  description: { color: C.gray, fontSize: 12, lineHeight: 18, marginTop: 5 },
});