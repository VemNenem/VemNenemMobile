import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Cabecalho from '@/src/components/headerblog';
import { getPostsInClient, Post, getImageUrl, formatDateTime } from '@/src/service/blogService';
import { getStoredJWT } from '@/src/service/loginService';

const PostScreen = () => {
  const { documentId } = useLocalSearchParams();
  const [post, setPost] = useState<Post | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (documentId && typeof documentId === 'string') {
      carregarPost(documentId);
    } else {
      Alert.alert('Erro', 'ID do post não fornecido');
      router.back();
    }
  }, [documentId]);

  const carregarPost = async (postDocumentId: string) => {
    setCarregando(true);
    try {
      const jwt = await getStoredJWT();

      if (!jwt) {
        Alert.alert('Erro', 'Você precisa estar logado para acessar os posts.', [
          { text: 'OK', onPress: () => router.replace('/') }
        ]);
        return;
      }

      const resultado = await getPostsInClient(jwt, postDocumentId);

      if (resultado.success && resultado.data) {
        setPost(resultado.data);
      } else {
        Alert.alert('Erro', resultado.message || 'Não foi possível carregar o post.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar post:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao carregar o post.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Cabecalho title="Blog" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#42CFE0" />
          <Text style={styles.loadingText}>Carregando post...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Cabecalho title="Blog" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Post não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Cabecalho title="Blog" />

        {post.image && post.image.url ? (
          <Image
            source={{ uri: getImageUrl(post.image.url) }}
            style={styles.coverImage}
            defaultSource={require('../../../../assets/images/logo.png')}
          />
        ) : (
          <View style={[styles.coverImage, styles.imagePlaceholder]}>
            <Text style={styles.imagePlaceholderText}>Sem imagem</Text>
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.centeredHeader}>
            <Text style={styles.authorName}>Por: {post.author}</Text>
            <Text style={styles.dateText}>{formatDateTime(post.createdAt)}</Text>
            <Text style={styles.postTitle}>{post.title}</Text>
          </View>
          <Text style={styles.postContent}>{post.text}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  coverImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
  },
  imagePlaceholder: {
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#999',
  },
  content: {
    marginTop: 16,
  },
  centeredHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 16,
    textAlign: 'justify',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
});

export default PostScreen;
