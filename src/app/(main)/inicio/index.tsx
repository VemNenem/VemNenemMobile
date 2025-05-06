import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { shadow } from '@/global/shadow';
import Cabecalho from '@/src/components/header';

export default function Inicio() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Cabecalho
          title="Inicio"
          route="../(social)/perfil"
          route2="../(social)/compartilhar"
        />

        {/* Cartão Parabéns */}
        <View style={[styles.cardContainer, styles.cardWithBorder]}>
          <ImageBackground
            source={require('../../../../assets/images/fundo_happy.png')}
            style={styles.cardParabens}
            imageStyle={styles.cardParabensImage}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Parabéns!</Text>
              <Text style={styles.weekNumber}>26</Text>
              <Text style={styles.weekLabel}>SEMANAS</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Cartão Faltam X semanas */}
        <View
          style={[shadow.default, styles.remainingCard, styles.cardWithBorder]}
        >
          <Text style={styles.remainingText}>Faltam apenas</Text>
          <Text style={styles.remainingTextBold}>13 semanas e 5 dias!</Text>
          <TouchableOpacity>
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>
          <View
            style={{
              height: 15,
              backgroundColor:  'rgba(66, 207, 224, 0.3)',
              borderRadius: 15,
              overflow: 'hidden',
              marginVertical: 10,
              width: '100%',
            }}
          >
            <View
              style={{ width: '50%', height: '100%', backgroundColor: '#42CFE0' }}
            />
          </View>
          <View style={styles.divider} />
        </View>

        {/* Cartão de Lembretes */}
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
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#21C7F2',
  },
  cardParabensImage: {
    resizeMode: 'cover',
    borderRadius: 10,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
  },
  weekNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 52
  },
  weekLabel: {
    fontSize: 18,
    color: '#fff',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  remainingCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  remainingText: {
    fontSize: 18,
    color: '#707070',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  remainingTextBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#707070',
    marginBottom: 8,
  },
  editText: {
    color: '#F67173',
    marginBottom: 12,
    textDecorationLine: 'underline',
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
    alignSelf: 'center',
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
