
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { C, Header, Button } from '../components/safe-run';

export default function ContatoScreen() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('saferun-contato').then((value) => {
      if (value) {
        const contato = JSON.parse(value);
        setNome(contato.nome ?? '');
        setTelefone(contato.telefone ?? '');
      }
    }).catch(() => {});
  }, []);

  async function salvar() {
    if (!nome.trim() || !telefone.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha o nome e o telefone.');
      return;
    }

    try {
      await AsyncStorage.setItem(
        'saferun-contato',
        JSON.stringify({ nome: nome.trim(), telefone: telefone.trim() }),
      );
      Alert.alert('Contato salvo', 'O contato foi salvo neste dispositivo.');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o contato.');
    }
  }

  return (
    <View style={s.page}>
      <Header title="Contato de emergência" />
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.icon}>
          <Ionicons name="person" size={35} color={C.white} />
        </View>

        <Text style={s.title}>Contato de emergência</Text>
        <Text style={s.description}>
          Informe quem poderá ser avisado em uma situação de emergência.
        </Text>

        <Text style={s.label}>Nome do contato</Text>
        <TextInput
          style={s.input}
          placeholder="Digite o nome"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={s.label}>Telefone</Text>
        <TextInput
          style={s.input}
          placeholder="Digite o telefone"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <Button title="Salvar contato" icon="save-outline" onPress={salvar} />

        <Text style={s.note}>
          O contato fica salvo no aplicativo. O envio automático de alertas
          ainda precisa de uma integração específica.
        </Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.white },
  content: { padding: 22 },
  icon: {
    width: 66, height: 66, borderRadius: 35, backgroundColor: C.blue,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
    marginVertical: 12,
  },
  title: {
    fontSize: 22, fontWeight: '800', color: C.dark,
    textAlign: 'center', marginBottom: 10,
  },
  description: {
    color: C.gray, textAlign: 'center', lineHeight: 22, marginBottom: 24,
  },
  label: { color: C.dark, fontSize: 14, fontWeight: '700', marginBottom: 7 },
  input: {
    height: 50, borderWidth: 1, borderColor: C.border, borderRadius: 12,
    paddingHorizontal: 14, marginBottom: 18, color: C.dark,
  },
  note: { color: C.gray, fontSize: 12, lineHeight: 19, marginTop: 12 },
});