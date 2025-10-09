import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Cabecalho from '@/src/components/headertools';
import { getMyData } from '@/src/service/perfilService';
import { getStoredJWT } from '@/src/service/loginService';

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

const posParto: Item[] = [
  { id: '9', texto: 'Elementum nibh commodo auctor neque.', checked: false },
  { id: '10', texto: 'Elementum nibh commodo auctor neque.', checked: false },
  { id: '11', texto: 'Elementum nibh commodo auctor neque.', checked: false },
  { id: '12', texto: 'Elementum nibh commodo auctor neque.', checked: false },
];

const cuidadosBebe: Item[] = [
  { id: '13', texto: 'Elementum nibh commodo auctor neque.', checked: false },
  { id: '14', texto: 'Elementum nibh commodo auctor neque.', checked: false },
  { id: '15', texto: 'Elementum nibh commodo auctor neque.', checked: false },
  { id: '16', texto: 'Elementum nibh commodo auctor neque.', checked: false },
];

const cesaria: Item[] = [
  { id: '17', texto: 'Elementum nibh commodo auctor neque.', checked: false },
  { id: '18', texto: 'Elementum nibh commodo auctor neque.', checked: false },
  { id: '19', texto: 'Elementum nibh commodo auctor neque.', checked: false },
  { id: '20', texto: 'Elementum nibh commodo auctor neque.', checked: false },
];

export default function PlanoDeParto() {
  const [trabalho, setTrabalho] = useState(trabalhoDeParto);
  const [partoItems, setPartoItems] = useState(parto);
  const [posPartoItems, setPosPartoItems] = useState(posParto);
  const [cuidadosBebeItems, setCuidadosBebeItems] = useState(cuidadosBebe);
  const [cesariaItems, setCesariaItems] = useState(cesaria);
  
  // Estados para os dados da API
  const [nomeMae, setNomeMae] = useState('');
  const [nomeBebe, setNomeBebe] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Pegar o token usando a função do loginService
      const token = await getStoredJWT();
      
      console.log('Token recuperado:', token ? 'Token existe' : 'Token não encontrado');
      
      if (token) {
        const response = await getMyData(token);
        
        console.log('Response da API:', response);
        console.log('Dados retornados:', response.data);
        
        if (response.success && response.data) {
          console.log('Nome da mãe:', response.data.name);
          console.log('Nome do bebê:', response.data.babyName);
          
          setNomeMae(response.data.name || '');
          setNomeBebe(response.data.babyName || '');
        } else {
          console.log('Erro na resposta:', response.message);
        }
      } else {
        console.log('Token não encontrado no AsyncStorage');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Cabecalho title="Plano de Parto" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#42cfe0" />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Cabecalho title="Plano de Parto" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <Text style={styles.tituloSecao}>PLANO DE PARTO</Text>
          <Text style={styles.dados}>
            NOME DO BEBÊ: {nomeBebe.toUpperCase() || 'NÃO INFORMADO'}
          </Text>
          <Text style={styles.dados}>
            NOME DA MÃE: {nomeMae.toUpperCase() || 'NÃO INFORMADO'}
          </Text>
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
          {posPartoItems.map((item) => renderItem(item, posPartoItems, setPosPartoItems))}
        </View>

        <View style={styles.section}>
          <Text style={styles.tituloSecao}>CUIDADOS COM O BEBÊ</Text>
          {cuidadosBebeItems.map((item) => renderItem(item, cuidadosBebeItems, setCuidadosBebeItems))}
        </View>

        <View style={styles.section}>
          <Text style={styles.tituloSecao}>CESÁRIA</Text>
          {cesariaItems.map((item) => renderItem(item, cesariaItems, setCesariaItems))}
        </View>

         <TouchableOpacity style={styles.botao}>
          <Text style={styles.textoBotao}>BAIXAR</Text>
        </TouchableOpacity>

        <Text style={styles.textoAdicionar}>
          Para adicionar outros itens ao seu plano de parto, entre em contato em nosso email suporte@vemnenem.app.
        </Text>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
  textoAdicionar: {
    paddingVertical: 20,
    textAlign: "center",
  },
});