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
import Cabecalho from '@/src/components/headertools';
import Popup from '@/src/components/popup'; // ajuste o caminho se necessário

const dadosIniciais = [
  { id: '1', nome: 'Chá de bebê', quantidade: 20 },
  { id: '2', nome: 'Enxoval', quantidade: 30 },
  { id: '3', nome: 'Casa', quantidade: 15 },
];

export default function Inicio() {
  const [listas, setListas] = useState(dadosIniciais);
  const [popupVisible, setPopupVisible] = useState(false);
  const [categoria, setCategoria] = useState(''); // Estado para controlar o texto do input do Popup

  // Função para adicionar nova categoria na lista
  const handleAddCategoria = (nome: string) => {
    if (!nome.trim()) return; // evita adicionar categoria vazia
    const novaLista = {
      id: (listas.length + 1).toString(),
      nome,
      quantidade: 0,
    };
    setListas([...listas, novaLista]);
    setCategoria(''); // limpa input do popup
    setPopupVisible(false); // fecha popup
  };

  const renderItem = ({ item }: { item: typeof listas[0] }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.quantidade}>{item.quantidade}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Cabecalho title="Lista" />

        <View style={styles.header}>
          <Text style={styles.titulo}>Minhas listas</Text>
          <TouchableOpacity onPress={() => setPopupVisible(true)}>
            <Ionicons name="add-circle-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={listas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 12, paddingBottom: 40 }}
        />
      </View>

      <Popup
        visible={popupVisible}
        onClose={() => {
          setPopupVisible(false);
          setCategoria(''); // limpa input ao fechar popup
        }}
        onSubmit={() => handleAddCategoria(categoria)}
        value={categoria}
        onChangeText={setCategoria}
      />
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
  },
  titulo: {
    fontSize: 16,
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  nome: {
    fontSize: 15,
    color: '#333',
  },
  quantidade: {
    fontSize: 15,
    color: '#999',
  },
});
