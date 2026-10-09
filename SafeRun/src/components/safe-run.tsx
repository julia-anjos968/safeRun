
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export const C = {
  blue: '#075EAD',
  dark: '#073B7A',
  red: '#FF2638',
  green: '#18B878',
  light: '#EAF6FF',
  border: '#D6E7F7',
  gray: '#64748B',
  white: '#FFFFFF',
};

export function Header({ title }: { title: string }) {
  return (
    <View style={s.header}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={s.back}
        accessibilityLabel="Voltar"
      >
        <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={s.headerTitle}>{title}</Text>
      <View style={s.back} />
    </View>
  );
}

export function Button({
  title,
  onPress,
  danger = false,
  outline = false,
  icon,
}: {
  title: string;
  onPress: () => void;
  danger?: boolean;
  outline?: boolean;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        s.button,
        danger && s.danger,
        outline && s.outline,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={21}
          color={outline ? C.blue : C.white}
        />
      )}
      <Text style={[s.buttonText, outline && s.outlineText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function BottomNav({
  active,
}: {
  active: 'inicio' | 'historico' | 'configuracoes';
}) {
  const items = [
    { key: 'inicio', label: 'Início', icon: 'home-outline' as const, path: '/' },
    { key: 'historico', label: 'Histórico', icon: 'time-outline' as const, path: '/historico' },
    { key: 'configuracoes', label: 'Configurações', icon: 'settings-outline' as const, path: '/configuracoes' },
  ];

  return (
    <View style={s.bottom}>
      {items.map((item) => {
        const selected = active === item.key;

        return (
          <TouchableOpacity
            key={item.key}
            style={s.bottomItem}
            onPress={() => router.replace(item.path as never)}
          >
            <Ionicons
              name={item.icon}
              size={23}
              color={selected ? C.blue : '#8AA1BC'}
            />
            <Text style={[s.bottomText, selected && s.bottomActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    height: 62,
    backgroundColor: C.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  back: {
    width: 38,
    alignItems: 'center',
  },
  headerTitle: {
    color: C.white,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  button: {
    minHeight: 52,
    backgroundColor: C.blue,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: 16,
    marginVertical: 7,
  },
  danger: {
    backgroundColor: C.red,
  },
  outline: {
    backgroundColor: C.white,
    borderWidth: 1.5,
    borderColor: C.blue,
  },
  buttonText: {
    color: C.white,
    fontWeight: '700',
    fontSize: 15,
  },
  outlineText: {
    color: C.blue,
  },
  card: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 15,
    padding: 15,
    marginBottom: 11,
    backgroundColor: C.white,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
    backgroundColor: C.white,
  },
  bottomItem: {
    alignItems: 'center',
    gap: 3,
    flex: 1,
  },
  bottomText: {
    fontSize: 11,
    color: '#8AA1BC',
  },
  bottomActive: {
    color: C.blue,
    fontWeight: '700',
  },
});