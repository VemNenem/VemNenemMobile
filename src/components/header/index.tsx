import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter, type RelativePathString } from 'expo-router';

interface CabecalhoProps {
  title: string;
  route: RelativePathString;
  route2: RelativePathString;
  backgroundColor?: string;
  textColor?: string;
}

export default function Cabecalho({
  title,
  route,
  route2,
  backgroundColor = '#fff',
  textColor = '#707070',
}: CabecalhoProps) {
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View style={[styles.header, { backgroundColor }]}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => router.push(route)} accessibilityLabel="Perfil do usuário">
            <View style={styles.iconCircle}>
              <Ionicons name="person-circle-outline" size={37} color="#ffffff" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        </View>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => router.push(route2)} accessibilityLabel="Lista de usuários">
            <Ionicons name="people-outline" size={24} color={textColor} />
          </TouchableOpacity>
        </View>
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
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#42CFE0',
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
