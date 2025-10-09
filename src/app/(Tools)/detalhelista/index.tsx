import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Item {
  id: string;
  nome: string;
  checked: boolean;
}

export default function DetalheLista() {
  const router = useRouter();
  const { nome } = useLocalSearchParams();
  const [itens, setItens] = useState<Item[]>([
    { id: '1', nome: 'Cama', checked: false },
    { id: '2', nome: 'Lixeira', checked: false },
    { id: '3', nome: 'Cômoda', checked: false },
    { id: '4', nome: 'Berço', checked: false },
    { id: '5', nome: 'Travesseiro', checked: false },
    { id: '6', nome: 'Luminária', checked: false },
  ]);

  const toggleCheck = (id: string) => {
    setItens(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemRow}>
      <TouchableOpacity
        onPress={() => toggleCheck(item.id)}
        style={styles.checkbox}
        activeOpacity={0.7}
      >
        {item.checked && <View style={styles.checked} />}
      </TouchableOpacity>
      <Text style={styles.itemText}>{item.nome}</Text>
      <View style={styles.icons}>
        <TouchableOpacity style={{ marginRight: 12 }}>
          <Ionicons name="pencil-outline" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="trash-outline" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{nome}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={{ marginRight: 12 }}>
            <Ionicons name="pencil-outline" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="add-circle-outline" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista */}
      <FlatList
        data={itens}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '500', color: '#333' },
  listContent: { paddingHorizontal: 16, paddingTop: 10 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#00CFE8',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    width: 12,
    height: 12,
    backgroundColor: '#00CFE8',
    borderRadius: 2,
  },
  itemText: { flex: 1, fontSize: 16, color: '#333' },
  icons: { flexDirection: 'row', alignItems: 'center' },
});
