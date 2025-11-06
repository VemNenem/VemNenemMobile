//Tela de termos de uso e privacidade

// Importações principais do React e React Native
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getTerms } from "../../../service/termsService"; // Função que busca os termos no backend

// Componente principal da tela de Termos e Política de Privacidade
export default function TermosPrivacidade() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Estados para controlar qual texto mostrar e o conteúdo carregado
  const [tipoSelecionado, setTipoSelecionado] = useState<'privacy' | 'terms'>('privacy');
  const [conteudo, setConteudo] = useState<string>("");
  const [carregando, setCarregando] = useState(true);

  // Carrega o conteúdo sempre que o tipo selecionado muda
  useEffect(() => {
    carregarTermos();
  }, [tipoSelecionado]);

  // Função que busca os termos no servidor
  const carregarTermos = async () => {
    setCarregando(true);
    try {
      const resultado = await getTerms(tipoSelecionado);

      if (resultado.success && resultado.data) {
        // Pega o texto retornado e define no estado
        const texto =
          resultado.data.content ||
          resultado.data.text ||
          resultado.data.description ||
          JSON.stringify(resultado.data, null, 2);
        setConteudo(texto);
      } else {
        // Caso haja erro, mostra alerta e usa texto padrão
        Alert.alert("Erro", resultado.message || "Não foi possível carregar os termos.");
        setConteudo(getConteudoPadrao());
      }
    } catch (error) {
      console.error("Erro ao carregar termos:", error);
      Alert.alert("Erro", "Ocorreu um erro ao carregar os termos.");
      setConteudo(getConteudoPadrao());
    } finally {
      setCarregando(false);
    }
  };

  // Retorna texto padrão caso não consiga buscar da API
  const getConteudoPadrao = () => {
    if (tipoSelecionado === 'privacy') {
      return `Política de Privacidade
1. Coleta de Dados ...
(Conteúdo padrão de privacidade)`;
    } else {
      return `Termos de Uso
1. Aceitação dos Termos ...
(Conteúdo padrão de termos de uso)`;
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
          <Text style={styles.title}>Termos de Uso e Política de Privacidade</Text>

          {/* Botões para mudar de Termos ou Privacidade */}
          <View style={styles.switchContainer}>
            <TouchableOpacity
              style={[
                styles.switchButton,
                tipoSelecionado === 'privacy' && styles.activeSwitch,
              ]}
              onPress={() => setTipoSelecionado('privacy')}
            >
              <Text
                style={[
                  styles.switchText,
                  tipoSelecionado === 'privacy' && styles.activeSwitchText,
                ]}
              >
                Privacidade
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.switchButton,
                tipoSelecionado === 'terms' && styles.activeSwitch,
              ]}
              onPress={() => setTipoSelecionado('terms')}
            >
              <Text
                style={[
                  styles.switchText,
                  tipoSelecionado === 'terms' && styles.activeSwitchText,
                ]}
              >
                Termos de Uso
              </Text>
            </TouchableOpacity>
          </View>

          {/* Mostra o conteúdo ou o indicador de carregamento */}
          {carregando ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#42CFE0" />
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          ) : (
            <ScrollView style={styles.scrollContainer}>
              <Text style={styles.termsText}>{conteudo}</Text>
            </ScrollView>
          )}

          {/* Botão para voltar */}
          <TouchableOpacity
            onPress={() => {
              if (params.returnStep) {
                router.push({
                  pathname: '/(Auth)/cadastro',
                  params: { step: params.returnStep },
                });
              } else {
                router.back();
              }
            }}
            style={styles.acceptButton}
          >
            <Text style={styles.acceptButtonText}>VOLTAR</Text>
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
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#707070",
  },
  switchContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    padding: 4,
    width: "100%",
  },
  switchButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 26,
    alignItems: "center",
  },
  switchText: {
    color: "#707070",
    fontSize: 14,
  },
  activeSwitch: {
    backgroundColor: "#42CFE0",
  },
  activeSwitchText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingContainer: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#707070",
    fontSize: 14,
  },
  scrollContainer: {
    width: "100%",
    maxHeight: 400,
    marginBottom: 20,
  },
  termsText: {
    color: "#707070",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "justify",
  },
  acceptButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
    borderColor: "#42CFE0",
    borderWidth: 1,
  },
  acceptButtonText: {
    color: "#42CFE0",
    fontWeight: "bold",
  },
});
