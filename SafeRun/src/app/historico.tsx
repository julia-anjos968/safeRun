
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { C, Header, Card, Button, BottomNav } from '../components/safe-run';

type CaminhadaSalva = {
  id: string;
  data: string;
  tempo: string;
  distancia: string;
  passos: string;
};

export default function HistoricoScreen() {
  const [caminhadas, setCaminhadas] = useState<CaminhadaSalva[]>([]);
  const [atualizando, setAtualizando] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem('saferun-historico');
      setCaminhadas(raw ? JSON.parse(raw) : []);
    } catch {
      setCaminhadas([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  async function atualizar() {
    setAtualizando(true);
    await carregar();
    setAtualizando(false);
  }

  return (
    <View style={s.page}>
      <Header title="Histórico" />
      <ScrollView
        contentContainerStyle={s.content}
        refreshControl={
          <RefreshControl refreshing={atualizando} onRefresh={atualizar} />
        }
      >
        {caminhadas.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="walk-outline" size={60} color={C.blue} />
            <Text style={s.title}>Nenhuma caminhada ainda</Text>
            <Text style={s.description}>
              Suas caminhadas aparecerão aqui depois que você realizar uma atividade.
            </Text>
            <Button title="Iniciar caminhada" onPress={() => router.push('/permissoes')} />
          </View>
        ) : (
          caminhadas.map((item) => (
            <Card key={item.id}>
              <View style={s.row}>
                <View style={s.icon}>
                  <Ionicons name="walk" size={25} color={C.blue} />
                </View>
                <View style={s.info}>
                  <Text style={s.date}>{item.data}</Text>
                  <Text style={s.detail}>{item.distancia} km • {item.tempo}</Text>
                  <Text style={s.detail}>Movimentos: {item.passos}</Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
      <BottomNav active="historico" />
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.white },
  content: { padding: 18, flexGrow: 1 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 21, color: C.dark, fontWeight: '800', textAlign: 'center', marginTop: 15 },
  description: { color: C.gray, lineHeight: 21, textAlign: 'center', marginVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: {
    width: 45, height: 45, borderRadius: 25, backgroundColor: C.light,
    alignItems: 'center', justifyContent: 'center',
  },
  info: { flex: 1 },
  date: { color: C.dark, fontSize: 14, fontWeight: '700' },
  detail: { color: C.gray, fontSize: 12, marginTop: 4 },
});