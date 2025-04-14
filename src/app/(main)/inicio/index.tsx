import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, SafeAreaView, ProgressBarAndroidBase, ProgressBarAndroidComponent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Inicio() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconCircle} />
          <Text style={styles.title}>Início</Text>
          <View style={styles.profileIcon} />
        </View>

        {/* Semana atual */}
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

        {/* Faltam semanas */}
        <View style={[styles.remainingCard, styles.cardWithBorder]}>
          <Text style={styles.remainingText}>Faltam apenas</Text>
          <Text style={styles.remainingTextBold}>13 semanas e 5 dias!</Text>
          <TouchableOpacity>
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>
          {/* Barra de progresso */}
          <View style={{ height: 10, backgroundColor: '#e0e0e0', borderRadius: 5, overflow: 'hidden', marginVertical: 10 }}>
            <View style={{ width: '50%', height: '100%', backgroundColor: '#21FFB5' }} />
          </View>
          <View style={styles.divider} />
        </View>

        {/* Lembretes */}
        <LinearGradient
          colors={['#E0F7F4', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
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
    paddingTop: 10, // Espaço adicional se necessário
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00D4A5',
  },
  profileIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#ccc',
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
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
    color: '#fff',
    marginBottom: 8,
  },
  weekText: {
    fontSize: 18,
    color: '#fff',
  },
  remainingCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  remainingText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  remainingTextBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
    color: '#333',
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