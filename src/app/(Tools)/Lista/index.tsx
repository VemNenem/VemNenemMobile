import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Cabecalho from '@/src/components/headertools';
import Popup from '@/src/components/popup';

interface Lista {
  id: string;
  nome: string;
  quantidade: number;
}

const dadosIniciais: Lista[] = [
  { id: '1', nome: 'Chá de bebê', quantidade: 20 },
  { id: '2', nome: 'Enxoval', quantidade: 30 },
  { id: '3', nome: 'Quarto', quantidade: 5 },
  { id: '4', nome: 'Higiene', quantidade: 0 },
];

export default function ListasScreen() {
  const router = useRouter();
  const [listas, setListas] = useState<Lista[]>(dadosIniciais);
  const [popupVisible, setPopupVisible] = useState(false);
  const [categoria, setCategoria] = useState('');

  const handleAddCategoria = (nome: string) => {
    if (!nome.trim()) return;
    
    const novaLista: Lista = {
      id: Date.now().toString(),
      nome: nome.trim(),
      quantidade: 0,
    };
    
    setListas([...listas, novaLista]);
    setCategoria('');
    setPopupVisible(false);
  };

  const handleSelectLista = (lista: Lista) => {
    router.push({
      pathname: '/detalhelista',
      params: {
        id: lista.id,
        nome: lista.nome,
        quantidade: lista.quantidade,
      },
    });
  };

  const renderItem = ({ item }: { item: Lista }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleSelectLista(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.quantidade}>{item.quantidade}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Cabecalho title="Listas" />

        <View style={styles.header}>
          <Text style={styles.titulo}>Minhas listas</Text>
          <TouchableOpacity
            onPress={() => setPopupVisible(true)}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="add-circle-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={listas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  titulo: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  listContent: {
    gap: 12,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  nome: {
    fontSize: 15,
    color: '#333',
    fontWeight: '400',
  },
  quantidade: {
    fontSize: 15,
    color: '#999',
    fontWeight: '400',
  },
});