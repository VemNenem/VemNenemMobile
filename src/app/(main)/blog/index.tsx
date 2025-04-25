import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ListRenderItem, SafeAreaView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Cabecalho from '@/src/components/header';



interface Post {
  id: string;
  title: string;
  author: string;
  image: any;
}

const posts: Post[] = [
  {
    id: '1',
    title: 'Práticas básicas de primeiros socorros',
    author: 'Bryan Henrique',
    image: require('../../../../assets/images/logo.png'),
  },
  {
    id: '2',
    title: 'Paternidade',
    author: 'Bryan Henrique',
    image: require('../../../../assets/images/logo.png'),
  },
  {
    id: '3',
    title: 'Como fazer sua lista de enxoval',
    author: 'Bryan Henrique',
    image: require('../../../../assets/images/logo.png'),
  },
  {
    id: '4',
    title: 'Muita cólica?',
    author: 'Bryan Henrique',
    image: require('../../../../assets/images/logo.png'),
  },
];

const Blog = () => {
  const renderItem: ListRenderItem<Post> = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>Por: {item.author}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <Cabecalho
          title="Blog"
          route="../(social)/perfil"
          route2="../(social)/compartilhar"
        />

        {/* Lista de posts */}
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Blog;

const styles = StyleSheet.create({

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    marginBottom: 20,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#42CFE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#707070',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    borderColor: '#e6d9f9',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  author: {
    fontSize: 12,
    color: '#666',
  },
});
