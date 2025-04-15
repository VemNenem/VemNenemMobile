import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CabecalhoComLogout from '@/src/components/headerlogout';
import { Ionicons } from '@expo/vector-icons';
import { RelativePathString, router } from 'expo-router';

const AlterarSenha = () => {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={20}
      >
        <View style={styles.headerWrapper}>
          <CabecalhoComLogout
            title="Alterar senha"
            route={"inicio" as RelativePathString}
            rightIcon="log-out-outline"
            backgroundColor="#42CFE0"
            textColor="#fff"
          />
        </View>

        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formBox}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Senha atual</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!mostrarSenhaAtual}
                  value={senhaAtual}
                  onChangeText={setSenhaAtual}
                />
                <TouchableOpacity onPress={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}>
                  <Ionicons name={mostrarSenhaAtual ? 'eye-off' : 'eye'} size={24} color="gray" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Digite a nova senha</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!mostrarNovaSenha}
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                />
                <TouchableOpacity onPress={() => setMostrarNovaSenha(!mostrarNovaSenha)}>
                  <Ionicons name={mostrarNovaSenha ? 'eye-off' : 'eye'} size={24} color="gray" />
                </TouchableOpacity>
              </View>
              <View style={styles.regrasContainer}>
                <Text style={styles.regrasText}>• Use pelo menos 8 caracteres</Text>
                <Text style={styles.regrasText}>
                  • Inclua pelo menos 1 letra minúscula, 1 maiúscula e 1 caractere especial, como "!@#"
                </Text>
                <Text style={styles.regrasText}>• Certifique-se de usar uma senha forte</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Confirmar nova senha</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!mostrarConfirmarSenha}
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                />
                <TouchableOpacity onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}>
                  <Ionicons name={mostrarConfirmarSenha ? 'eye-off' : 'eye'} size={24} color="gray" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>ALTERAR SENHA</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
              <Text style={styles.secondaryButtonText}>VOLTAR</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AlterarSenha;

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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  regrasContainer: {
    marginTop: 10,
  },
  regrasText: {
    fontSize: 12,
    color: '#42CFE0',
    marginBottom: 4,
  },
  primaryButton: {
    backgroundColor: '#42CFE0',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secondaryButton: {
    marginTop: 10,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#42CFE0',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#42CFE0',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
});
