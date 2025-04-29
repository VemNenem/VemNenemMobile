import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Cabecalho from '@/src/components/header';

const ListasScreen = () => {
  const router = useRouter();

  const listas = [
    { nome: 'Chá de bebé', quantidade: 20 },
    { nome: 'Enxoval', quantidade: 30 },
    { nome: 'Casa', quantidade: 15 },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header - Mantendo o mesmo do seu componente Inicio */}
        <Cabecalho
          title="Listas"
          route="../(social)/perfil"
          route2="../(social)/compartilhar"
        />

        {/* Conteúdo principal */}
        <Text style={styles.title}>Minhas listas</Text>

        {/* Lista de itens */}
        <View style={styles.listaContainer}>
          {listas.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.itemContainer, styles.cardWithBorder]}
            >
              <Text style={styles.itemNome}>{item.nome}</Text>
              <Text style={styles.itemQuantidade}>{item.quantidade}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  timeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'medium',
    marginBottom: 20,
    color: '#707070',
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
  listaContainer: {
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  cardWithBorder: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
  },
  itemNome: {
    fontSize: 18,
    color: '#333',
  },
  itemQuantidade: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#42CFE0',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 20,
  },
  footerItem: {
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 16,
    color: '#42CFE0',
  },
});

export default ListasScreen;