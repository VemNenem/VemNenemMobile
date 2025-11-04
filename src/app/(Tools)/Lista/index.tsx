import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Cabecalho from '@/src/components/headertools';
import { listList, createList, updateList, deleteList, Lista } from '@/src/service/listaService';
import { getStoredJWT } from '@/src/service/loginService';

interface ListPopupProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (nome: string) => Promise<void>;
  title: string;
  placeholder: string;
  confirmText: string;
  initialValue?: string;
}

function ListPopup({
  visible,
  onClose,
  onConfirm,
  title,
  placeholder,
  confirmText,
  initialValue = '',
}: ListPopupProps) {
  const [nome, setNome] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setNome(initialValue);
    }
  }, [visible, initialValue]);

  const handleConfirm = async () => {
    if (nome.trim()) {
      setLoading(true);
      await onConfirm(nome);
      setLoading(false);
      setNome('');
    }
  };

  const handleClose = () => {
    setNome('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={popupStyles.overlay}>
        <View style={popupStyles.popup}>
          <Text style={popupStyles.title}>{title}</Text>

          <TextInput
            style={popupStyles.input}
            placeholder={placeholder}
            value={nome}
            onChangeText={setNome}
            autoFocus
            editable={!loading}
          />

          <View style={popupStyles.buttons}>
            <TouchableOpacity
              style={[popupStyles.button, popupStyles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={popupStyles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[popupStyles.button, popupStyles.confirmButton]}
              onPress={handleConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={popupStyles.confirmText}>{confirmText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const popupStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  cancelText: {
    color: '#666',
    fontWeight: '500',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default function ListasScreen() {
  const router = useRouter();
  const [listas, setListas] = useState<Lista[]>([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [jwt, setJwt] = useState<string>('');
  const [selectedLista, setSelectedLista] = useState<Lista | null>(null);

  useEffect(() => {
    loadJwtAndFetchListas();
  }, []);

  const loadJwtAndFetchListas = async () => {
    try {
      const token = await getStoredJWT();

      if (token) {
        setJwt(token);
        await fetchListas(token);
      } else {
        Alert.alert('Erro', 'Token de autenticação não encontrado');
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao carregar token:', error);
      Alert.alert('Erro', 'Erro ao carregar dados de autenticação');
      setLoading(false);
    }
  };

  const fetchListas = async (token: string) => {
    try {
      setLoading(true);
      const response = await listList(token);
      if (response.success && response.data) {
        setListas(response.data);
      } else {
        Alert.alert('Erro', response.message || 'Erro ao buscar listas');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar listas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    if (jwt) {
      setRefreshing(true);
      await fetchListas(jwt);
    }
  };

  const handleAddCategoria = async (nome: string) => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Por favor, insira um nome para a lista');
      return;
    }

    try {
      const response = await createList(jwt, { name: nome.trim() });

      if (response.success && response.data) {
        setListas([...listas, response.data]);
        setPopupVisible(false);
        Alert.alert('Sucesso', 'Lista criada com sucesso!');
      } else {
        Alert.alert('Erro', response.message || 'Erro ao criar lista');
      }
    } catch (error) {
      console.error('Erro ao criar lista:', error);
      Alert.alert('Erro', 'Erro ao criar lista');
    }
  };

  const handleEditLista = (lista: Lista) => {
    setSelectedLista(lista);
    setEditPopupVisible(true);
  };

  const handleUpdateLista = async (novoNome: string) => {
    if (!selectedLista || !novoNome.trim()) {
      Alert.alert('Atenção', 'Por favor, insira um nome para a lista');
      return;
    }

    try {
      const response = await updateList(jwt, selectedLista.documentId, {
        name: novoNome.trim(),
      });

      if (response.success && response.data) {
        setListas(
          listas.map((lista) =>
            lista.documentId === selectedLista.documentId ? response.data! : lista
          )
        );
        setEditPopupVisible(false);
        setSelectedLista(null);
        Alert.alert('Sucesso', 'Lista atualizada com sucesso!');
      } else {
        Alert.alert('Erro', response.message || 'Erro ao atualizar lista');
      }
    } catch (error) {
      console.error('Erro ao atualizar lista:', error);
      Alert.alert('Erro', 'Erro ao atualizar lista');
    }
  };

  const handleDeleteLista = (lista: Lista) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir a lista "${lista.name}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await deleteList(jwt, lista.documentId);

              if (response.success) {
                setListas(listas.filter((l) => l.documentId !== lista.documentId));
                Alert.alert('Sucesso', 'Lista excluída com sucesso!');
              } else {
                Alert.alert('Erro', response.message || 'Erro ao excluir lista');
              }
            } catch (error) {
              console.error('Erro ao excluir lista:', error);
              Alert.alert('Erro', 'Erro ao excluir lista');
            }
          },
        },
      ]
    );
  };

  const handleSelectLista = (lista: Lista) => {
    router.push({
      pathname: '/detalhelista',
      params: {
        documentId: lista.documentId,
        nome: lista.name,
        id: lista.id.toString(),
      },
    });
  };

  const renderItem = ({ item }: { item: Lista }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => handleSelectLista(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.nome}>{item.name}</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditLista(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="pencil-outline" size={20} color="#5dd4e3" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteLista(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="list-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Nenhuma lista criada</Text>
      <Text style={styles.emptySubtext}>
        Toque no botão + para criar sua primeira lista
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Cabecalho title="Listas" />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5dd4e3" />
            <Text style={styles.loadingText}>Carregando listas...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
          keyExtractor={(item) => item.documentId}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            listas.length === 0 && styles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />

        <ListPopup
          visible={popupVisible}
          onClose={() => setPopupVisible(false)}
          onConfirm={handleAddCategoria}
          title="Nova Lista"
          placeholder="Nome da lista"
          confirmText="Criar"
        />

        <ListPopup
          visible={editPopupVisible}
          onClose={() => {
            setEditPopupVisible(false);
            setSelectedLista(null);
          }}
          onConfirm={handleUpdateLista}
          title="Editar Lista"
          placeholder="Nome da lista"
          confirmText="Salvar"
          initialValue={selectedLista?.name || ''}
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
  emptyListContent: {
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 8,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    paddingRight: 8,
  },
  nome: {
    fontSize: 15,
    color: '#333',
    fontWeight: '400',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});