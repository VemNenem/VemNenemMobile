import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Cabecalho from '@/src/components/header';

const Perfil = () => {
  const [nome, setNome] = useState('Julia Oliveira');
  const [dpp, setDpp] = useState('30/06/2025');
  const [sexoBebe, setSexoBebe] = useState('Masculino');
  const [nomeBebe, setNomeBebe] = useState('Lucas');
  const [nomePai, setNomePai] = useState('Bryan Henrique');

  return (
    <View style={styles.wrapper}>
      <View style={{ backgroundColor: '#42CFE0' }}>
      <Cabecalho
  title="Perfil"
  route="../(main)/inicio"
  route2="../(social)/compartilhar"
  backgroundColor="#42CFE0"
  textColor="#fff"
/>

</View>

      <ScrollView contentContainerStyle={styles.profileContainer}>
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
            <TextInput
              style={styles.input}
              value={dpp}
              onChangeText={setDpp}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#aaa"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Sexo do bebê</Text>
            <TextInput
              style={styles.input}
              value={sexoBebe}
              onChangeText={setSexoBebe}
              placeholder="Masculino ou Feminino"
              placeholderTextColor="#aaa"
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

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Alterar senha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>SALVAR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>DELETAR CONTA</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Perfil;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#42CFE0',
  },
  profileContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  formBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginTop: 10,
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
  button: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: "500",
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
