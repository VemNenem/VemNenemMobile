import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CabecalhoComLogout from '@/src/components/headerlogout';
import { RelativePathString, router } from 'expo-router';
import { getMyData, updateClient, deleteMyClient } from '@/src/service/perfilService';
import { getStoredJWT, logout } from '@/src/service/loginService';

const Perfil = () => {
  const [nome, setNome] = useState('');
  const [dpp, setDpp] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sexoBebe, setSexoBebe] = useState('');
  const [nomeBebe, setNomeBebe] = useState('');
  const [nomePai, setNomePai] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarDadosPerfil();
  }, []);

  const carregarDadosPerfil = async () => {
    setCarregando(true);
    try {
      const jwt = await getStoredJWT();
      if (!jwt) {
        Alert.alert('Erro', 'Você precisa estar logado para acessar esta página.');
        router.replace('/');
        return;
      }
      const resultado = await getMyData(jwt);
      if (resultado.success && resultado.data) {
        const { data } = resultado;
        setNome(data.name || '');
        setDpp(data.probableDateOfDelivery ? new Date(data.probableDateOfDelivery) : null);
        setSexoBebe(data.babyGender || '');
        setNomeBebe(data.babyName || '');
        setNomePai(data.fatherName || '');
      } else {
        Alert.alert('Erro', resultado.message || 'Não foi possível carregar os dados do perfil.');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao carregar os dados.');
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvar = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Por favor, preencha seu nome.');
      return;
    }
    if (!dpp) {
      Alert.alert('Erro', 'Por favor, selecione a Data Provável do Parto.');
      return;
    }
    if (!sexoBebe) {
      Alert.alert('Erro', 'Por favor, selecione o sexo do bebê.');
      return;
    }

    setSalvando(true);
    try {
      const jwt = await getStoredJWT();
      if (!jwt) {
        Alert.alert('Erro', 'Sessão expirada. Faça login novamente.');
        router.replace('/');
        return;
      }

      const dataFormatada = dpp.toISOString().split('T')[0];
      const dadosAtualizados = {
        name: nome,
        probableDateOfDelivery: dataFormatada,
        babyGender: sexoBebe,
        babyName: nomeBebe,
      };

      const resultado = await updateClient(jwt, dadosAtualizados);
      if (resultado.success) {
        Alert.alert('Sucesso', resultado.message || 'Perfil atualizado com sucesso!');
      } else {
        Alert.alert('Erro', resultado.message || 'Não foi possível atualizar o perfil.');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar os dados.');
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletarConta = () => {
    Alert.alert('Confirmar exclusão', 'Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Deletar', style: 'destructive', onPress: confirmarDelecao },
    ]);
  };

  const confirmarDelecao = async () => {
    try {
      const jwt = await getStoredJWT();
      if (!jwt) {
        Alert.alert('Erro', 'Sessão expirada. Faça login novamente.');
        router.replace('/');
        return;
      }
      const resultado = await deleteMyClient(jwt);
      if (resultado.success) {
        await logout();
        Alert.alert('Sucesso', resultado.message || 'Conta deletada com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/');
            },
          },
        ]);
      } else {
        Alert.alert('Erro', resultado.message || 'Não foi possível deletar a conta.');
      }
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao deletar a conta.');
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDpp(selectedDate);
  };

  if (carregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerWrapper}>
          <CabecalhoComLogout title="Perfil" route={"inicio" as RelativePathString} backgroundColor="#42CFE0" textColor="#fff" />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={20}>
        <View style={styles.headerWrapper}>
          <CabecalhoComLogout title="Perfil" route={"inicio" as RelativePathString} backgroundColor="#42CFE0" textColor="#fff" />
        </View>

        <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} extraScrollHeight={20} enableOnAndroid={true}>
          <View style={styles.formBox}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nome</Text>
              <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Digite seu nome" placeholderTextColor="#aaa" />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>DPP (Data Provável do Parto)</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
                <View style={styles.input} pointerEvents="none">
                  <Text style={dpp ? styles.dateText : styles.placeholderText}>
                    {dpp ? dpp.toLocaleDateString('pt-BR') : 'DD/MM/AAAA'}
                  </Text>
                </View>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={dpp || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  locale="pt-BR"
                  onChange={handleDateChange}
                />
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Sexo do bebê</Text>
              <View style={styles.radioContainer}>
                {['Masculino', 'Feminino'].map((sexo) => (
                  <TouchableOpacity
                    key={sexo}
                    style={[styles.radioButton, sexoBebe === sexo && styles.radioSelected]}
                    onPress={() => setSexoBebe(sexo)}
                  >
                    <Text style={[styles.radioText, sexoBebe === sexo && { color: '#fff' }]}>{sexo}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nome do bebê</Text>
              <TextInput
                style={styles.input}
                value={nomeBebe}
                onChangeText={setNomeBebe}
                placeholder="Digite o nome do bebê"
                placeholderTextColor="#aaa"
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/(social)/senha')}>
              <Text style={styles.buttonText}>Alterar senha</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.saveButton, salvando && styles.saveButtonDisabled]} onPress={handleSalvar} disabled={salvando}>
              {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>SALVAR</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDeletarConta}>
              <Text style={styles.deleteButtonText}>DELETAR CONTA</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Perfil;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#42CFE0',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerWrapper: {
    backgroundColor: '#42CFE0',
  },
  scrollContent: {
    flexGrow: 1,
  },
  formBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#707070',
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    fontSize: 16,
    color: '#aaa',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: '#42CFE0',
    borderColor: '#42CFE0',
  },
  radioText: {
    fontSize: 16,
    color: '#000',
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#707070',
    textDecorationLine: 'underline',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#42CFE0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F67173',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
});
