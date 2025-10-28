import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { shadow } from '@/global/shadow';
import Cabecalho from '@/src/components/header';
import { router } from 'expo-router';
import { getHome, HomeData } from '@/src/service/inicioService';
import { getStoredJWT } from '@/src/service/loginService';


export default function Inicio() {
  const navigation = useNavigation();
  const [carregando, setCarregando] = useState(true);
  const [dados, setDados] = useState<HomeData | null>(null);

  useEffect(() => {
    carregarDadosHome();
  }, []);

  const carregarDadosHome = async () => {
    setCarregando(true);
    try {
      // Buscar o JWT do usuário logado
      const jwt = await getStoredJWT();

      if (!jwt) {
        Alert.alert('Erro', 'Você precisa estar logado para acessar esta página.');
        router.replace('/');
        return;
      }

      // Buscar dados da home
      const resultado = await getHome(jwt);

      if (resultado.success && resultado.data) {
        setDados(resultado.data);
      } else {
        Alert.alert('Erro', resultado.message || 'Não foi possível carregar os dados.');
      }
    } catch (error) {
      console.error('Erro ao carregar dados da home:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao carregar os dados.');
    } finally {
      setCarregando(false);
    }
  };

  const formatarData = (dataString: string): string => {
    // Dividir a data string para evitar problemas de timezone
    const [ano, mes, dia] = dataString.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia); // mes - 1 porque Date usa 0-11 para meses

    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    // Resetar horas para comparação apenas de datas
    hoje.setHours(0, 0, 0, 0);
    amanha.setHours(0, 0, 0, 0);
    data.setHours(0, 0, 0, 0);

    if (data.getTime() === hoje.getTime()) {
      return 'Hoje';
    } else if (data.getTime() === amanha.getTime()) {
      return 'Amanhã';
    } else {
      return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  };

  const calcularProgresso = (): number => {
    if (!dados) return 0;
    const totalSemanas = dados.currentWeek + dados.remaining.weeks;
    return totalSemanas > 0 ? (dados.currentWeek / totalSemanas) * 100 : 0;
  };

  if (carregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Cabecalho title="Inicio" route="../(social)/perfil" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#42CFE0" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Cabecalho
          title="Inicio"
          route="../(social)/perfil"
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
              <Text style={styles.weekNumber}>{dados?.currentWeek || 0}</Text>
              <Text style={styles.weekLabel}>SEMANAS</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Cartão Faltam X semanas */}
        <View
          style={[shadow.default, styles.remainingCard, styles.cardWithBorder]}
        >
          <Text style={styles.remainingText}>Faltam apenas</Text>
          <Text style={styles.remainingTextBold}>
            {dados?.remaining.weeks || 0} semanas e {dados?.remaining.days || 0} dias!
          </Text>
          <TouchableOpacity onPress={() => router.push('/(social)/perfil')}>
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>
          <View
            style={{
              height: 15,
              backgroundColor: 'rgba(66, 207, 224, 0.3)',
              borderRadius: 15,
              overflow: 'hidden',
              marginVertical: 10,
              width: '100%',
            }}
          >
            <View
              style={{ width: `${calcularProgresso()}%`, height: '100%', backgroundColor: '#42CFE0' }}
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
          {dados?.schedule && dados.schedule.length > 0 ? (
            dados.schedule.map((lembrete) => (
              <View key={lembrete.id} style={styles.reminderItem}>
                <View style={styles.reminderHeader}>
                  <Text style={styles.reminderTitle}>{lembrete.name}</Text>
                  <Text style={styles.reminderDate}>
                    {formatarData(lembrete.date)} {lembrete.time && `- ${lembrete.time}`}
                  </Text>
                </View>
                <Text style={styles.reminderDescription}>
                  {lembrete.description}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.reminderItem}>
              <Text style={styles.noRemindersText}>Nenhum lembrete agendado</Text>
            </View>
          )}
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
  noRemindersText: {
    color: '#707070',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
