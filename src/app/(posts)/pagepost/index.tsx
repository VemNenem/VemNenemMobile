import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Image 
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Cabecalho from '@/src/components/headerblog';
import { posts } from './data'; 

const PostScreen = () => {
  const { id } = useLocalSearchParams();
  const post = posts.find(p => p.id === id);

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  if (!post) return (
    <SafeAreaView style={styles.safeArea}>
      <Text>Post não encontrado</Text>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Cabecalho title="Blog" />

        <Image source={post.image} style={styles.coverImage} />

        <View style={styles.content}>

          <View style={styles.centeredHeader}>
            <Text style={styles.authorName}>Por: {post.author}</Text>
            <Text style={styles.postTitle}>{post.title}</Text>
          </View>
          <Text style={styles.postContent}>{post.content}</Text>

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
});

export default PostScreen;
