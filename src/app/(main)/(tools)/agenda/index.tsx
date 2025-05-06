import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { shadow } from '@/global/shadow';
import Cabecalho from '@/src/components/header';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Listas() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Cabecalho
          title="Listas"
          route='../(social)/perfil'
          route2='../(social)/compartilhar'
        />

        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Minhas listas</Text>
          <TouchableOpacity style={styles.addButton}>
          <AntDesign name="pluscircleo" size={24} color="#707070" />
          </TouchableOpacity>
        </View>

        {/* Lista de Itens */}
        <View style={styles.listContainer}>
  <View style={[styles.cardWithBorder, shadow.default]}>
    <TouchableOpacity style={styles.listItem}>
      <Text style={styles.listItemName}>Chá de bebê</Text>
      <Text style={styles.listItemCount}>20</Text>
    </TouchableOpacity>
  </View>

  <View style={styles.spacer} />

  <View style={[styles.cardWithBorder, shadow.default]}>
    <TouchableOpacity style={styles.listItem}>
      <Text style={styles.listItemName}>Enxoval</Text>
      <Text style={styles.listItemCount}>30</Text>
    </TouchableOpacity>
  </View>

  <View style={styles.spacer} />

  <View style={[styles.cardWithBorder, shadow.default]}>
    <TouchableOpacity style={styles.listItem}>
      <Text style={styles.listItemName}>Casa</Text>
      <Text style={styles.listItemCount}>15</Text>
    </TouchableOpacity>
  </View>
</View>


        {/* Espaço para o conteúdo rolar acima da navegação inferior */}
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 10,
    paddingBottom: 80,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#707070',
  },
  addButton: {
    padding: 8,
  },
  cardWithBorder: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
  },
  listContainer: {
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  listItemName: {
    fontSize: 16,
    color: '#333',
  },
  listItemCount: {
    fontSize: 16,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  spacer: {
    height: 10,
  },
  
});