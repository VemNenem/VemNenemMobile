import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

export default function TermosPrivacidade() {
  const router = useRouter();

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

          <ScrollView style={styles.scrollContainer}>
            <Text style={styles.termsText}>
              1. Aceitação dos Termos
              Ao acessar ou utilizar nosso serviço, você concorda com estes Termos de Uso e Política de Privacidade. Se não concordar, não utilize nossos serviços.

              2. Coleta de Dados
              Podemos coletar informações pessoais, como:

              Nome

              E-mail

              Endereço IP

              Dados de navegação

              3. Uso dos Dados
              Os dados coletados podem ser usados para:

              Melhorar nossos serviços

              Personalizar sua experiência

              Enviar comunicações (se autorizado)

              4. Compartilhamento de Dados
              Não vendemos seus dados, mas podemos compartilhá-los com:

              Parceiros de confiança

              Autoridades legais (se exigido por lei)

              5. Cookies
              Utilizamos cookies para melhorar a experiência do usuário. Você pode desativá-los nas configurações do navegador.

              6. Segurança
              Empregamos medidas de segurança para proteger seus dados, mas nenhum sistema é 100% invulnerável.

              7. Alterações nos Termos
              Reservamos o direito de modificar estes termos a qualquer momento. Alterações serão comunicadas por e-mail ou notificação no site.

              8. Rescisão
              Podemos encerrar ou suspender seu acesso sem aviso prévio em caso de violação destes termos.

              9. Lei Aplicável
              Estes termos são regidos pelas leis do [País Aleatório] e quaisquer disputas serão resolvidas nos tribunais locais.            </Text>
          </ScrollView>

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
