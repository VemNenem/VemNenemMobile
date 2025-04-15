import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter, type RelativePathString } from 'expo-router';

interface CabecalhoProps {
  title: string;
  route: RelativePathString;
  route2: RelativePathString;
}

export default function Cabecalho({ title, route, route2 }: CabecalhoProps) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={() => router.push(route)}
              accessibilityLabel="Perfil do usuário"
            >
              <View style={styles.iconCircle}>
                <Ionicons name="person-circle-outline" size={37} color="#ffffff" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={() => router.push(route2)}
              accessibilityLabel="Lista de usuários"
            >
              <Ionicons name="people-outline" size={24} color="#707070" />
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#fff',
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
    color: '#707070',
  },
  safeArea: {
    backgroundColor: '#fff',
  },
  container: {
    paddingTop: 10,
  },
});
