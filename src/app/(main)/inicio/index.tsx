import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { shadow } from '@/global/shadow';
import Cabecalho from '@/src/components/cabecalho';

export default function Inicio() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Cabecalho
        title="Inicio"
        route='../(social)/perfil'
        route2='../(social)/compartilhar'
        ></Cabecalho>

        <View style={[styles.cardContainer, styles.cardWithBorder]}>
          <ImageBackground
            source={require('../../../../assets/images/balao.png')}
            style={styles.cardParabens}
            imageStyle={styles.cardParabensImage}
          >
            <Text style={styles.congratsTitle}>Parabéns!</Text>
            <Text style={styles.weekText}>Você está de 26 semanas!</Text>
          </ImageBackground>
        </View>        

        <View style={[shadow.default, styles.remainingCard, styles.cardWithBorder]}>
          <Text style={styles.remainingText}>Faltam apenas</Text>
          <Text style={styles.remainingTextBold}>13 semanas e 5 dias!</Text>
          <TouchableOpacity>
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>
          <View style={{ height: 10, backgroundColor: '#e0e0e0', borderRadius: 5, overflow: 'hidden', marginVertical: 10 }}>
            <View style={{ width: '50%', height: '100%', backgroundColor: '#21FFB5' }} />
          </View>
          <View style={styles.divider} />
        </View>
        
        <LinearGradient
          colors={['#42CFE0', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.remindersContainer, styles.cardWithBorder]}
        >
          <Text style={styles.sectionTitle}>Lembretes</Text>
          <View style={styles.reminderItem}>
            <View style={styles.reminderHeader}>
              <Text style={styles.reminderTitle}>Título</Text>
              <Text style={styles.reminderDate}>Hoje</Text>
            </View>
            <Text style={styles.reminderDescription}>
              Descrição: Lorem ipsum dolor sit amet, consectetur adipiscint ipsum dolor
            </Text>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#fff',
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
  cardContainer: {
    marginBottom: 16,
  },
  cardWithBorder: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardParabens: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  cardParabensImage: {
    borderRadius: 10,
  },
  congratsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F67173',
    marginBottom: 8,
  },
  weekText: {
    fontSize: 18,
    color: '#F67173',
    fontWeight: "500",
  },
  remainingCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  remainingText: {
    fontSize: 16,
    color: '#707070',
    marginBottom: 4,
  },
  remainingTextBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#707070',
    marginBottom: 8,
  },
  editText: {
    color: 'red',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#eee',
    marginTop: 8,
  },
  remindersContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#ffffff',
    alignSelf: "center"
  },
  reminderItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reminderTitle: {
    fontWeight: 'bold',
    color: '#333',
  },
  reminderDate: {
    color: '#888',
  },
  reminderDescription: {
    color: '#555',
    fontSize: 14,
  },
});