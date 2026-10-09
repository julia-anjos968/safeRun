
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { C, Header, Button } from '../components/safe-run';

export default function AlertaQuedaScreen() {
  const [contador, setContador] = useState(30);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setContador((v) => Math.max(0, v - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function estouBem() {
    router.back();
  }

  function semResposta() {
    Alert.alert(
      'Alerta de emergência',
      'Nenhuma confirmação foi registrada. No protótipo, o alerta é apenas simulado.',
      [{ text: 'Entendi', onPress: () => router.replace('/') }],
    );
  }

  return (
    <View style={s.page}>
      <Header title="Alerta de possível queda" />
      <View style={s.content}>
        <View style={s.alertIcon}>
          <Ionicons name="warning" size={65} color={C.white} />
        </View>

        <Text style={s.title}>Você está bem?</Text>
        <Text style={s.description}>
          Identificamos um movimento brusco e queremos saber se você está bem.
        </Text>

        <Button
          title="Sim, estou bem"
          icon="checkmark-circle"
          onPress={estouBem}
          danger
        />
        <Button
          title="Não responde"
          icon="alert-circle-outline"
          outline
          onPress={semResposta}
        />

        <View style={s.timer}>
          <Ionicons name="time-outline" size={28} color={C.blue} />
          <View>
            <Text style={s.timerLabel}>Tempo para resposta</Text>
            <Text style={s.timerValue}>00:{String(contador).padStart(2, '0')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.white },
  content: { flex: 1, alignItems: 'stretch', justifyContent: 'center', padding: 24 },
  alertIcon: {
    width: 105, height: 105, borderRadius: 32, backgroundColor: C.red,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
    marginBottom: 22,
  },
  title: { fontSize: 27, color: C.dark, fontWeight: '800', textAlign: 'center' },
  description: {
    color: C.gray, textAlign: 'center', lineHeight: 22,
    marginTop: 12, marginBottom: 22,
  },
  timer: {
    alignSelf: 'center', flexDirection: 'row', gap: 12, alignItems: 'center',
    backgroundColor: C.light, padding: 15, borderRadius: 15, marginTop: 15,
  },
  timerLabel: { color: C.gray, fontSize: 12 },
  timerValue: { color: C.dark, fontWeight: '800', fontSize: 22, marginTop: 3 },
});