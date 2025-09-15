import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Cabecalho from '@/src/components/headertools';

interface Item {
  id: string;
  texto: string;
  checked: boolean;
}

const trabalhoDeParto: Item[] = [
  { id: '1', texto: 'Elementum nibh commodo auctor neque.', checked: false },
  { id: '2', texto: 'Elementum nibh commodo auctor neque.', checked: false },
  { id: '3', texto: 'Elementum nibh commodo auctor neque.', checked: false },
  { id: '4', texto: 'Elementum nibh commodo auctor neque.', checked: false },
];

const parto: Item[] = [
  { id: '5', texto: 'Elementum nibh commodo auctor neque.', checked: false },
  { id: '6', texto: 'Elementum nibh commodo auctor neque.', checked: false },
  { id: '7', texto: 'Elementum nibh commodo auctor neque.', checked: false },
  { id: '8', texto: 'Elementum nibh commodo auctor neque.', checked: false },
];

export default function PlanoDeParto() {
  const [trabalho, setTrabalho] = useState(trabalhoDeParto);
  const [partoItems, setPartoItems] = useState(parto);

  const toggleCheck = (
    list: Item[],
    setList: React.Dispatch<React.SetStateAction<Item[]>>,
    id: string
  ) => {
    const atualizada = list.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setList(atualizada);
  };

  const renderItem = (
    item: Item,
    list: Item[],
    setList: React.Dispatch<React.SetStateAction<Item[]>>
  ) => (
    <View key={item.id} style={styles.item}>
      <TouchableOpacity onPress={() => toggleCheck(list, setList, item.id)}>
        <Ionicons
          name={item.checked ? 'checkbox' : 'square-outline'}
          size={24}
          color="#42cfe0"
        />
      </TouchableOpacity>
      <Text style={styles.itemTexto}>{item.texto}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Cabecalho title="Plano de Parto" />

        <View style={styles.section}>
          <Text style={styles.tituloSecao}>PLANO DE PARTO</Text>
          <Text style={styles.dados}>NOME DO BEBÊ: LUCAS</Text>
          <Text style={styles.dados}>NOME DA MÃE: JULIA OLIVEIRA</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.tituloSecao}>TRABALHO DE PARTO</Text>
          {trabalho.map((item) => renderItem(item, trabalho, setTrabalho))}
        </View>

        <View style={styles.section}>
          <Text style={styles.tituloSecao}>PARTO</Text>
          {partoItems.map((item) => renderItem(item, partoItems, setPartoItems))}
        </View>

        <View style={styles.section}>
          <Text style={styles.tituloSecao}>PÓS PARTO</Text>
          {partoItems.map((item) => renderItem(item, partoItems, setPartoItems))}
        </View>

        <View style={styles.section}>
          <Text style={styles.tituloSecao}>CUIDADOS COM O BEBÊ</Text>
          {partoItems.map((item) => renderItem(item, partoItems, setPartoItems))}
        </View>

        <View style={styles.section}>
          <Text style={styles.tituloSecao}>CESÁRIA</Text>
          {partoItems.map((item) => renderItem(item, partoItems, setPartoItems))}
        </View>

         <TouchableOpacity style={styles.botao}>
  <Text style={styles.textoBotao}>BAIXAR</Text>
</TouchableOpacity>
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
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  tituloSecao: {
    backgroundColor: '#42cfe0',
    color: '#fff',
    textAlign: 'center',
    padding: 10,
    borderRadius: 8,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dados: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemTexto: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
  },
  botao: {
    backgroundColor: '#4AC6DC', 
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: 16,
  },
});
