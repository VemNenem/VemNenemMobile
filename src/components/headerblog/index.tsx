import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface CabecalhoProps {
  title: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function CabecalhoLogout({
  title,
  backgroundColor = '#fff',
  textColor = '#707070',
}: CabecalhoProps) {
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={[styles.header, { backgroundColor }]}>
        {/* Botão Voltar à esquerda */}
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => router.push('/(main)/blog')} accessibilityLabel="Voltar">
  <Ionicons name="chevron-back-outline" size={28} color={textColor} />
</TouchableOpacity>

        </View>

        {/* Título */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        </View>

        {/* Espaço reservado para manter alinhamento */}
        <View style={styles.iconContainer} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    marginBottom: 20,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  safeArea: {},
});
