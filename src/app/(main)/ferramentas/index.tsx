import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Tool {
  id: string;
  name: string;
  icon: string;
}

const tools: Tool[] = [
  { id: '1', name: 'Listas', icon: 'list-outline' },
  { id: '2', name: 'Plano de Parto', icon: 'clipboard-outline' },
  { id: '3', name: 'Agenda', icon: 'calendar-outline' },
];

const Ferramentas = () => {
  const renderItem = ({ item }: { item: Tool }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.iconBox}>
      <Ionicons nameame={item.icon} size={22} color="#fff" />
      </View>
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="person-circle-outline" size={37} color="#ffffff" />
            </View>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Ferramentas</Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="people-outline" size={24} color="#707070" />
          </View>
        </View>

      {/* Lista */}
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
        color: '#707070',
      },
      profileIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
      },
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
    borderRadius: 10
  },

 card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#EFEFEF"
  },
  cardText: {
    padding: 16,
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
});
