import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Cabecalho from '@/src/components/headertools';
import { getMyData } from '@/src/service/perfilService';
import { getStoredJWT } from '@/src/service/loginService';
import {
  listChildbirthPlans,
  selectOrUnselectChildbirthPlan,
  generateChildbirthPlanPDF,
  ChildbirthPlan,
} from '@/src/service/planoDePartoService';

export default function PlanoDeParto() {
  const [childbirthPlans, setChildbirthPlans] = useState<ChildbirthPlan[]>([]);

  // Estados para os dados da API
  const [nomeMae, setNomeMae] = useState('');
  const [nomeBebe, setNomeBebe] = useState('');
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);

      const token = await getStoredJWT();

      console.log('Token recuperado:', token ? 'Token existe' : 'Token não encontrado');

      if (token) {
        // Carregar dados do perfil
        const profileResponse = await getMyData(token);

        if (profileResponse.success && profileResponse.data) {
          setNomeMae(profileResponse.data.name || '');
          setNomeBebe(profileResponse.data.babyName || '');
        } else {
          console.log('Erro na resposta do perfil:', profileResponse.message);
        }

        // Carregar planos de parto da API
        const plansResponse = await listChildbirthPlans();

        if (plansResponse.success && plansResponse.data) {
          setChildbirthPlans(plansResponse.data);
        } else {
          Alert.alert('Erro', plansResponse.message || 'Erro ao carregar planos de parto');
        }
      } else {
        console.log('Token não encontrado no AsyncStorage');
        Alert.alert('Erro', 'Usuário não autenticado');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = async (plan: ChildbirthPlan) => {
    const action = plan.clientSelect ? 'unselect' : 'select';

    try {
      const response = await selectOrUnselectChildbirthPlan(plan.documentId, action);

      if (response.success) {
        // Atualizar o estado local
        setChildbirthPlans(prevPlans =>
          prevPlans.map(p =>
            p.documentId === plan.documentId
              ? { ...p, clientSelect: !p.clientSelect }
              : p
          )
        );
      } else {
        Alert.alert('Erro', response.message || 'Erro ao atualizar plano');
      }
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      Alert.alert('Erro', 'Erro ao atualizar plano');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setGeneratingPDF(true);

      const response = await generateChildbirthPlanPDF();

      if (response.success && response.data) {
        const filename = response.data as string;

        Alert.alert(
          'PDF Gerado',
          `Seu plano de parto foi gerado com sucesso: ${filename}`,
          [
            {
              text: 'OK',
              onPress: () => console.log('PDF gerado:', filename),
            },
          ]
        );
      } else {
        Alert.alert('Erro', response.message || 'Erro ao gerar PDF');
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      Alert.alert('Erro', 'Erro ao gerar PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const renderPlanItem = (plan: ChildbirthPlan) => (
    <View key={plan.documentId} style={styles.item}>
      <TouchableOpacity onPress={() => toggleCheck(plan)}>
        <Ionicons
          name={plan.clientSelect ? 'checkbox' : 'square-outline'}
          size={24}
          color="#42cfe0"
        />
      </TouchableOpacity>
      <Text style={styles.itemTexto}>{plan.name}</Text>
    </View>
  );

  const groupPlansByType = (plans: ChildbirthPlan[]) => {
    return plans.reduce((acc, plan) => {
      if (!acc[plan.type]) {
        acc[plan.type] = [];
      }
      acc[plan.type].push(plan);
      return acc;
    }, {} as Record<string, ChildbirthPlan[]>);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Cabecalho title="Plano de Parto" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#42cfe0" />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const groupedPlans = groupPlansByType(childbirthPlans);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Cabecalho title="Plano de Parto" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.section}>
          <Text style={styles.tituloSecao}>PLANO DE PARTO</Text>
          <Text style={styles.dados}>
            NOME DO BEBÊ: {nomeBebe.toUpperCase() || 'NÃO INFORMADO'}
          </Text>
          <Text style={styles.dados}>
            NOME DA MÃE: {nomeMae.toUpperCase() || 'NÃO INFORMADO'}
          </Text>
        </View>

        {Object.entries(groupedPlans).map(([type, plans]) => (
          <View key={type} style={styles.section}>
            <Text style={styles.tituloSecao}>{type.toUpperCase()}</Text>
            {plans.map(plan => renderPlanItem(plan))}
          </View>
        ))}

        <TouchableOpacity
          style={[styles.botao, generatingPDF && styles.botaoDisabled]}
          onPress={handleDownloadPDF}
          disabled={generatingPDF}
        >
          {generatingPDF ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.textoBotao}>BAIXAR</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.textoAdicionar}>
          Para adicionar outros itens ao seu plano de parto, entre em contato em nosso email suporte@vemnenem.app.
        </Text>

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
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  tituloSecao: {
    backgroundColor: '#42cfe0',
    color: '#fff',
    textAlign: 'center',
    padding: 10,
    borderRadius: 8,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dados: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemTexto: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
  },
  botao: {
    backgroundColor: '#4AC6DC',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  botaoDisabled: {
    opacity: 0.6,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: 16,
  },
  textoAdicionar: {
    paddingVertical: 20,
    textAlign: "center",
  },
});