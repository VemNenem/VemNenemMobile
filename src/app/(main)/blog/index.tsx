import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ListRenderItem,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import Cabecalho from '@/src/components/header';
import { listPostsInClient, Post, getImageUrl, truncateText, formatDate } from '@/src/service/blogService';
import { getStoredJWT } from '@/src/service/loginService';

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => {
    carregarPosts();
  }, []);

  const carregarPosts = async (isRefreshing = false) => {
    if (isRefreshing) {
      setAtualizando(true);
    } else {
      setCarregando(true);
    }

    try {
      // Buscar o JWT do usuário logado
      const jwt = await getStoredJWT();

      if (!jwt) {
        Alert.alert('Erro', 'Você precisa estar logado para acessar os posts.');
        router.replace('/');
        return;
      }

      const resultado = await listPostsInClient(jwt);

      if (resultado.success && resultado.data) {
        setPosts(resultado.data);
      } else {
        Alert.alert('Erro', resultado.message || 'Não foi possível carregar os posts.');
      }
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao carregar os posts.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  };

  const handleRefresh = () => {
    carregarPosts(true);
  };

  const renderItem: ListRenderItem<Post> = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(posts)/pagepost?documentId=${item.documentId}`)}
    >
      {item.image && item.image.url ? (
        <Image
          source={{ uri: getImageUrl(item.image.url) }}
          style={styles.image}
          defaultSource={require('../../../../assets/images/logo.png')}
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.imagePlaceholderText}>Sem imagem</Text>
        </View>
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.author}>Por: {item.author}</Text>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (carregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Cabecalho
            title="Blog"
            route="../(social)/perfil"
          />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#42CFE0" />
            <Text style={styles.loadingText}>Carregando posts...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Cabecalho
          title="Blog"
          route="../(social)/perfil"
        />
        <FlatList
          data={posts}
          keyExtractor={(item) => item.documentId}
          renderItem={renderItem}
          refreshing={atualizando}
          onRefresh={handleRefresh}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum post disponível</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Blog;

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
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  imagePlaceholder: {
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#707070',
    marginBottom: 4,
  },
  author: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  date: {
    fontSize: 11,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#707070',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
