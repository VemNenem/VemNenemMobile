import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { listTopic, createTopic, updateTopic, deleteTopic, Topic } from '@/src/service/detalhesListaService';
import { updateList } from '@/src/service/listaService';
import { getStoredJWT } from '@/src/service/loginService';

// Popup para criar/editar item
interface ItemPopupProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (nome: string) => Promise<void>;
  title: string;
  placeholder: string;
  confirmText: string;
  initialValue?: string;
}

function ItemPopup({
  visible,
  onClose,
  onConfirm,
  title,
  placeholder,
  confirmText,
  initialValue = '',
}: ItemPopupProps) {
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

export default function DetalheLista() {
  const router = useRouter();
  const { documentId, nome, id } = useLocalSearchParams();
  const [itens, setItens] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [jwt, setJwt] = useState<string>('');
  const [listName, setListName] = useState<string>(nome as string || '');
  const [addPopupVisible, setAddPopupVisible] = useState(false);
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [editListPopupVisible, setEditListPopupVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Topic | null>(null);

  useEffect(() => {
    loadJwtAndFetchItens();
  }, []);

  const loadJwtAndFetchItens = async () => {
    try {
      const token = await getStoredJWT();

      if (token) {
        setJwt(token);
        await fetchItens(token);
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

  const fetchItens = async (token: string) => {
    try {
      setLoading(true);
      const response = await listTopic(token, documentId as string);

      if (response.success && response.data) {
        setItens(response.data);
      } else {
        Alert.alert('Erro', response.message || 'Erro ao buscar itens');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar itens');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    if (jwt) {
      setRefreshing(true);
      await fetchItens(jwt);
    }
  };

  const handleAddItem = async (nomeItem: string) => {
    if (!nomeItem.trim()) {
      Alert.alert('Atenção', 'Por favor, insira um nome para o item');
      return;
    }

    try {
      const response = await createTopic(jwt, {
        name: nomeItem.trim(),
        listDocumentId: documentId as string,
      });

      if (response.success && response.data) {
        setItens([...itens, response.data]);
        setAddPopupVisible(false);
        Alert.alert('Sucesso', 'Item adicionado com sucesso!');
      } else {
        Alert.alert('Erro', response.message || 'Erro ao adicionar item');
      }
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      Alert.alert('Erro', 'Erro ao adicionar item');
    }
  };

  const handleEditItem = (item: Topic) => {
    setSelectedItem(item);
    setEditPopupVisible(true);
  };

  const handleUpdateItem = async (novoNome: string) => {
    if (!selectedItem || !novoNome.trim()) {
      Alert.alert('Atenção', 'Por favor, insira um nome para o item');
      return;
    }

    try {
      const response = await updateTopic(jwt, selectedItem.documentId, {
        name: novoNome.trim(),
      });

      if (response.success && response.data) {
        setItens(
          itens.map((item) =>
            item.documentId === selectedItem.documentId ? response.data! : item
          )
        );
        setEditPopupVisible(false);
        setSelectedItem(null);
        Alert.alert('Sucesso', 'Item atualizado com sucesso!');
      } else {
        Alert.alert('Erro', response.message || 'Erro ao atualizar item');
      }
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      Alert.alert('Erro', 'Erro ao atualizar item');
    }
  };

  const handleDeleteItem = (item: Topic) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir o item "${item.name}"?`,
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
              const response = await deleteTopic(jwt, item.documentId);

              if (response.success) {
                setItens(itens.filter((i) => i.documentId !== item.documentId));
                Alert.alert('Sucesso', 'Item excluído com sucesso!');
              } else {
                Alert.alert('Erro', response.message || 'Erro ao excluir item');
              }
            } catch (error) {
              console.error('Erro ao excluir item:', error);
              Alert.alert('Erro', 'Erro ao excluir item');
            }
          },
        },
      ]
    );
  };

  const handleEditListName = async (novoNome: string) => {
    if (!novoNome.trim()) {
      Alert.alert('Atenção', 'Por favor, insira um nome para a lista');
      return;
    }

    try {
      const response = await updateList(jwt, documentId as string, {
        name: novoNome.trim(),
      });

      if (response.success && response.data) {
        setListName(response.data.name);
        setEditListPopupVisible(false);
        Alert.alert('Sucesso', 'Nome da lista atualizado com sucesso!');
      } else {
        Alert.alert('Erro', response.message || 'Erro ao atualizar nome da lista');
      }
    } catch (error) {
      console.error('Erro ao atualizar nome da lista:', error);
      Alert.alert('Erro', 'Erro ao atualizar nome da lista');
    }
  };

  const renderItem = ({ item }: { item: Topic }) => (
    <View style={styles.itemRow}>
      <Text style={styles.itemText}>{item.name}</Text>
      <View style={styles.icons}>
        <TouchableOpacity
          style={{ marginRight: 12 }}
          onPress={() => handleEditItem(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="pencil-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteItem(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="albums-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Nenhum item adicionado</Text>
      <Text style={styles.emptySubtext}>
        Toque no botão + para adicionar o primeiro item
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>{listName}</Text>
          <View style={styles.headerIcons} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregando itens...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{listName}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={{ marginRight: 12 }}
            onPress={() => setEditListPopupVisible(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="pencil-outline" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setAddPopupVisible(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="add-circle-outline" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista */}
      <FlatList
        data={itens}
        keyExtractor={(item) => item.documentId}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          itens.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {/* Popup para adicionar item */}
      <ItemPopup
        visible={addPopupVisible}
        onClose={() => setAddPopupVisible(false)}
        onConfirm={handleAddItem}
        title="Novo Item"
        placeholder="Nome do item"
        confirmText="Adicionar"
      />

      {/* Popup para editar item */}
      <ItemPopup
        visible={editPopupVisible}
        onClose={() => {
          setEditPopupVisible(false);
          setSelectedItem(null);
        }}
        onConfirm={handleUpdateItem}
        title="Editar Item"
        placeholder="Nome do item"
        confirmText="Salvar"
        initialValue={selectedItem?.name || ''}
      />

      {/* Popup para editar nome da lista */}
      <ItemPopup
        visible={editListPopupVisible}
        onClose={() => setEditListPopupVisible(false)}
        onConfirm={handleEditListName}
        title="Editar Nome da Lista"
        placeholder="Nome da lista"
        confirmText="Salvar"
        initialValue={listName}
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
  listContent: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20 },
  emptyListContent: {
    flexGrow: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  itemText: { flex: 1, fontSize: 16, color: '#333' },
  icons: { flexDirection: 'row', alignItems: 'center' },
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