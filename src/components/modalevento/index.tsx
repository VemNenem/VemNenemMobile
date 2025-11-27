import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

interface ModalAdicionarEventoProps {
  visivel: boolean;
  onFechar: () => void;
  onSalvar: (titulo: string, descricao: string, time: string) => void;
  dataEscolhida: string;
}

export default function ModalAdicionarEvento({
  visivel,
  onFechar,
  onSalvar,
  dataEscolhida,
}: ModalAdicionarEventoProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [time, setTime] = useState("");

  const formatarHorario = (texto: string) => {
    const apenasNumeros = texto.replace(/[^0-9]/g, '');

    if (apenasNumeros.length === 0) return '';
    if (apenasNumeros.length <= 2) return apenasNumeros;

    const horas = apenasNumeros.substring(0, 2);
    const minutos = apenasNumeros.substring(2, 4);

    return `${horas}:${minutos}`;
  };

  const validarHorario = (horario: string): boolean => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(horario);
  };

  const handleTimeChange = (texto: string) => {
    const horarioFormatado = formatarHorario(texto);
    setTime(horarioFormatado);
  };

  const handleSalvar = () => {
    if (titulo.trim() === "") {
      alert("Por favor, insira um título");
      return;
    }

    if (time.trim() === "") {
      alert("Por favor, insira um horário");
      return;
    }

    if (!validarHorario(time)) {
      alert("Por favor, insira um horário válido no formato HH:mm (ex: 14:30)");
      return;
    }

    onSalvar(titulo, descricao, time);
    setTitulo("");
    setDescricao("");
    setTime("");
  };

  const handleVoltar = () => {
    setTitulo("");
    setDescricao("");
    setTime("");
    onFechar();
  };

  return (
    <Modal
      visible={visivel}
      animationType="fade"
      transparent={true}
      onRequestClose={handleVoltar}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              placeholder="Título"
              placeholderTextColor="#999"
              value={titulo}
              onChangeText={setTitulo}
            />

            <Text style={styles.label}>Horário</Text>
            <TextInput
              style={styles.input}
              placeholder="HH:mm (ex: 14:30)"
              placeholderTextColor="#999"
              value={time}
              onChangeText={handleTimeChange}
              keyboardType="numeric"
              maxLength={5}
            />

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.inputDescricao]}
              placeholder="Descrição"
              placeholderTextColor="#999"
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.botaoCadastrar} onPress={handleSalvar}>
              <Text style={styles.textoBotaoCadastrar}>CADASTRAR</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoVoltar} onPress={handleVoltar}>
              <Text style={styles.textoBotaoVoltar}>VOLTAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
  },
  inputDescricao: {
    height: 120,
    paddingTop: 12,
  },
  botaoCadastrar: {
    backgroundColor: "#5dd4e3",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  textoBotaoCadastrar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  botaoVoltar: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#5dd4e3",
  },
  textoBotaoVoltar: {
    color: "#5dd4e3",
    fontSize: 16,
    fontWeight: "600",
  },
});