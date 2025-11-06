//Tela de recuparação de senha

// Importações do React e React Native
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { forgotPassword } from '@/src/service/esqueciSenhaService';

export default function RecuperarSenha() {
  const router = useRouter(); // Para navegação entre telas
  const [email, setEmail] = useState(""); //Estado para armazenar o email digitado
  const [loading, setLoading] = useState(false); //Estado apra indicar se está carregando

  //Função chamada ao clicar no botão "ENVIAR"
  const handleEnviar = async () => {
    if (!email.trim()) {
      Alert.alert("Atenção", "Por favor, insira seu email");
      return;
    }

    //Ativa o indicador de carregamento
    setLoading(true);
    try {
      const response = await forgotPassword({ email: email.trim() });

      //Mostra o alerta de sucesso e redireciona para a tela de redefinição
      if (response.success) {
        Alert.alert(
          "Sucesso",
          response.message || "Email de recuperação enviado com sucesso!",
          [
            {
              text: "OK",
              onPress: () => router.push("/redefinir" as any),
            },
          ]
        );
        setEmail("");
      } else {
        Alert.alert("Erro", response.message || "Erro ao enviar email de recuperação");
      }
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      Alert.alert("Erro", "Erro ao enviar email de recuperação. Tente novamente.");
    } finally {
      setLoading(false); //Desativa o indicador de carregamento
    }
  };

  return (
    <ImageBackground
      source={require("../../../../assets/images/background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image source={require("../../../../assets/images/logo.png")} style={styles.logo} />

        <View style={styles.card}>
          <Text style={styles.title}>Recuperar senha</Text>

          <Text style={styles.description}>
            O email precisa ter sido cadastrado na plataforma anteriormente
          </Text>
          {/* Input de email */}
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor="#707070"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Botão para enviar email */}
          <TouchableOpacity
            style={[styles.continueButton, loading && styles.buttonDisabled]}
            onPress={handleEnviar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.continueButtonText}>ENVIAR</Text>
            )}
          </TouchableOpacity>

          {/* Botão para voltar */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.backButtonText}>VOLTAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
// Estilos
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#707070"
  },
  description: {
    fontSize: 14,
    color: "#707070",
    textAlign: "center",
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#707070",
    alignSelf: "flex-start",
    width: "100%",
  },
  input: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 16,
    marginBottom: 30,
    fontSize: 16,
    color: "#000",
  },
  continueButton: {
    backgroundColor: "#42CFE0",
    borderRadius: 10,
    width: "100%",
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    borderWidth: 1,
    borderColor: "#42CFE0",
    borderRadius: 10,
    width: "100%",
    paddingVertical: 14,
    alignItems: "center",
  },
  backButtonText: {
    color: "#42CFE0",
    fontWeight: "bold",
    fontSize: 16,
  },
});