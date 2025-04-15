import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CabecalhoComLogout from '@/src/components/headerlogout';
import { RelativePathString, router } from 'expo-router';

const Perfil = () => {
  const [nome, setNome] = useState('');
  const [dpp, setDpp] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sexoBebe, setSexoBebe] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [sexoOptions, setSexoOptions] = useState([
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Feminino', value: 'Feminino' },
  ]);
  const [nomeBebe, setNomeBebe] = useState('');
  const [nomePai, setNomePai] = useState('');

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDpp(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={20}
      >
        <View style={styles.headerWrapper}>
          <CabecalhoComLogout
            title="Perfil"
            route={"inicio" as RelativePathString}
            rightIcon="log-out-outline"
            backgroundColor="#42CFE0"
            textColor="#fff"
          />
        </View>

        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={20}
          enableOnAndroid={true}
        >
          <View style={styles.formBox}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Digite seu nome"
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>DPP (Data Provável do Parto)</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                  style={styles.input}
                  value={dpp ? dpp.toLocaleDateString('pt-BR') : ''}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#aaa"
                  editable={false}
                  pointerEvents="none"
                />
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

            {/* DropDown com zIndex maior para não causar erro */}
            <View style={[styles.fieldContainer, { zIndex: 3000 }]}>
              <Text style={styles.label}>Sexo do bebê</Text>
              <DropDownPicker
                open={openDropdown}
                value={sexoBebe}
                items={sexoOptions}
                setOpen={setOpenDropdown}
                setValue={setSexoBebe}
                setItems={setSexoOptions}
                placeholder="Selecione o sexo"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                zIndex={3000}
                zIndexInverse={1000}
                listMode="SCROLLVIEW"
              />
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

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nome do pai</Text>
              <TextInput
                style={styles.input}
                value={nomePai}
                onChangeText={setNomePai}
                placeholder="Digite o nome do pai"
                placeholderTextColor="#aaa"
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/senha')}>
              <Text style={styles.buttonText}>Alterar senha</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>SALVAR</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton}>
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
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    borderColor: '#ccc',
    backgroundColor: '#fff',
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
});

