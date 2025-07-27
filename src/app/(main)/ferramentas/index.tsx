import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Cabecalho from '@/src/components/header';

interface Tool {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: any; // Usamos 'any' como solução prática para o Expo Router
}

const tools: Tool[] = [
  { id: '1', name: 'Listas', icon: 'list-outline', route: '/Lista' },
  { id: '2', name: 'Plano de Parto', icon: 'clipboard-outline', route: '/Plano' },
  { id: '3', name: 'Agenda', icon: 'calendar-outline', route: '/Agenda' },
];

const Ferramentas = () => {
  const router = useRouter();

  const renderItem = ({ item }: { item: Tool }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(item.route)}
    >
      <View style={styles.iconBox}>
        <Ionicons name={item.icon} size={22} color="#fff" />
      </View>
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Cabecalho
          title="Ferramentas"
          route="../(social)/perfil"
        />

        <FlatList
          data={tools}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ gap: 12 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Ferramentas;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 10,
  },
  iconBox: {
    backgroundColor: '#42CFE0',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
     shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardText: {
    padding: 16,
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
});