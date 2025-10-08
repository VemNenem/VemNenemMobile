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
import { useRouter } from "expo-router";
import { getTerms } from "../../../service/termsService";

export default function TermosPrivacidade() {
  const router = useRouter();
  const [tipoSelecionado, setTipoSelecionado] = useState<'privacy' | 'terms'>('privacy');
  const [conteudo, setConteudo] = useState<string>("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarTermos();
  }, [tipoSelecionado]);

  const carregarTermos = async () => {
    setCarregando(true);
    try {
      const resultado = await getTerms(tipoSelecionado);

      if (resultado.success && resultado.data) {
        // Adapte conforme a estrutura real da resposta da API
        const texto = resultado.data.content || resultado.data.text || resultado.data.description || JSON.stringify(resultado.data, null, 2);
        setConteudo(texto);
      } else {
        Alert.alert("Erro", resultado.message || "Não foi possível carregar os termos.");
        // Conteúdo padrão caso a API falhe
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

  const getConteudoPadrao = () => {
    if (tipoSelecionado === 'privacy') {
      return `Política de Privacidade

1. Coleta de Dados
Podemos coletar informações pessoais, como nome, e-mail, endereço IP e dados de navegação.

2. Uso dos Dados
Os dados coletados podem ser usados para melhorar nossos serviços, personalizar sua experiência e enviar comunicações (se autorizado).

3. Compartilhamento de Dados
Não vendemos seus dados, mas podemos compartilhá-los com parceiros de confiança e autoridades legais (se exigido por lei).

4. Segurança
Empregamos medidas de segurança para proteger seus dados, mas nenhum sistema é 100% invulnerável.

5. Seus Direitos
Você tem o direito de acessar, corrigir ou excluir seus dados pessoais a qualquer momento.`;
    } else {
      return `Termos de Uso

1. Aceitação dos Termos
Ao acessar ou utilizar nosso serviço, você concorda com estes Termos de Uso. Se não concordar, não utilize nossos serviços.

2. Uso do Serviço
Você concorda em usar o serviço apenas para fins legais e de acordo com estes termos.

3. Propriedade Intelectual
Todo o conteúdo do serviço é protegido por direitos autorais e outras leis de propriedade intelectual.

4. Alterações nos Termos
Reservamos o direito de modificar estes termos a qualquer momento. Alterações serão comunicadas por e-mail ou notificação no aplicativo.

5. Rescisão
Podemos encerrar ou suspender seu acesso sem aviso prévio em caso de violação destes termos.`;
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

          {/* Toggle entre Termos e Privacidade */}
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

          <TouchableOpacity onPress={() => router.back()} style={styles.acceptButton}>
            <Text style={styles.acceptButtonText}>VOLTAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

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
