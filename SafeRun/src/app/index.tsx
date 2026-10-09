
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { C, Button, BottomNav, Card } from '../components/safe-run';

export default function HomeScreen() {
  return (
    <View style={s.page}>
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.hero}>
          <View style={s.logoIcon}>
            <Ionicons name="walk" size={59} color={C.white} />
          </View>
          <Text style={s.logo}>
            Safe<Text style={{ color: C.red }}>Run</Text>
          </Text>
          <Text style={s.subtitle}>Mais segurança</Text>
          <Text style={s.subtitle}>em cada passo.</Text>
          <View style={s.message}>
            <Ionicons name="shield-checkmark" size={20} color={C.blue} />
            <Text style={s.messageText}>
              Sua segurança durante cada caminhada.
            </Text>
          </View>
        </View>

        <View style={s.actions}>
          <Button
            title="Iniciar caminhada"
            icon="play"
            onPress={() => router.push('/permissoes')}
          />

          <Card>
            <Button
              title="Histórico"
              icon="time-outline"
              outline
              onPress={() => router.push('/historico')}
            />
            <Button
              title="Configurações"
              icon="settings-outline"
              outline
              onPress={() => router.push('/configuracoes')}
            />
            <Button
              title="Contato de emergência"
              icon="call-outline"
              outline
              onPress={() => router.push('/contato')}
            />
          </Card>
        </View>
      </ScrollView>
      <BottomNav active="inicio" />
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.white },
  content: { flexGrow: 1, paddingBottom: 15 },
  hero: {
    minHeight: 390,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.light,
    borderBottomLeftRadius: 42,
    borderBottomRightRadius: 42,
    padding: 25,
  },
  logoIcon: {
    width: 100,
    height: 100,
    borderRadius: 32,
    backgroundColor: C.blue,
    borderWidth: 4,
    borderColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logo: { fontSize: 43, fontWeight: '800', color: C.dark },
  subtitle: { fontSize: 18, color: C.dark, lineHeight: 26 },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  messageText: { color: C.dark, fontSize: 12 },
  actions: { padding: 20 },
});