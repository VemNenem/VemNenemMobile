import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createClient } from "../../../service/cadastroService";
import { getTerms } from "../../../service/termsService";

export default function Cadastro() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState<'privacy' | 'terms'>('privacy');
  const [conteudo, setConteudo] = useState<string>("");
  const [carregandoTermos, setCarregandoTermos] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    dpp: "",
    sexoBebe: "",
    nomeBebe: "",
    nomePai: "",
  });

  const [dppDate, setDppDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Carrega os termos quando o modal é aberto ou quando muda o tipo
  useEffect(() => {
    if (showTermsModal) {
      carregarTermos();
    }
  }, [showTermsModal, tipoSelecionado]);

  const carregarTermos = async () => {
    setCarregandoTermos(true);
    try {
      const resultado = await getTerms(tipoSelecionado);

      if (resultado.success && resultado.data) {
        // Adapte conforme a estrutura real da resposta da API
        const texto = resultado.data.content || resultado.data.text || resultado.data.description || JSON.stringify(resultado.data, null, 2);
        setConteudo(texto);
      } else {
        // Conteúdo padrão caso a API falhe
        setConteudo(getConteudoPadrao());
      }
    } catch (error) {
      console.error("Erro ao carregar termos:", error);
      setConteudo(getConteudoPadrao());
    } finally {
      setCarregandoTermos(false);
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

  const handleChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Converte data de DD/MM/YYYY para YYYY-MM-DD
  const convertDateToISO = (dateString: string): string => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDppDate(selectedDate);
      const formattedDate = selectedDate.toLocaleDateString("pt-BR");
      handleChange("dpp", formattedDate);
    }
  };

  const handleSubmit = async () => {
    if (step === 1) {
      // Validação básica do step 1
      if (!formData.nome || !formData.email || !formData.senha) {
        Alert.alert("Erro", "Preencha todos os campos obrigatórios");
        return;
      }
      setStep(2);
    } else {
      // Validação básica do step 2
      if (!formData.dpp || !formData.sexoBebe) {
        Alert.alert("Erro", "Preencha todos os campos obrigatórios");
        return;
      }

      // Validação de aceite dos termos
      if (!acceptedTerms) {
        Alert.alert(
          "Atenção",
          "Você precisa aceitar os Termos de Uso e Política de Privacidade para continuar"
        );
        return;
      }

      setLoading(true);

      try {
        const result = await createClient({
          name: formData.nome,
          email: formData.email,
          password: formData.senha,
          probableDateOfDelivery: convertDateToISO(formData.dpp),
          babyGender: formData.sexoBebe,
          babyName: formData.nomeBebe,
          fatherName: formData.nomePai,
        });

        if (result.success) {
          Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
            {
              text: "OK",
              onPress: () => router.push("/(main)/inicio"),
            },
          ]);
        } else {
          Alert.alert("Erro", result.message || "Erro ao realizar cadastro");
        }
      } catch (error) {
        Alert.alert("Erro", "Erro inesperado ao realizar cadastro");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ImageBackground
      source={require("../../../../assets/images/background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image
          source={require("../../../../assets/images/logo.png")}
          style={styles.logo}
        />

        <View style={styles.card}>
          <Text style={styles.title}>Cadastro</Text>

          {step === 1 ? (
            <ScrollView style={styles.formContainer}>
              <View style={styles.fieldContainer}>
                <Text style={styles.inputLabel}>Nome</Text>
                <TextInput
                  value={formData.nome}
                  onChangeText={(text) => handleChange("nome", text)}
                  style={styles.input}
                  placeholder="Digite seu nome"
                  placeholderTextColor="#aaa"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.inputLabel}>E-mail</Text>
                <TextInput
                  value={formData.email}
                  onChangeText={(text) => handleChange("email", text)}
                  keyboardType="email-address"
                  style={styles.input}
                  placeholder="Digite seu e-mail"
                  placeholderTextColor="#aaa"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.inputLabel}>Senha</Text>
                <TextInput
                  value={formData.senha}
                  onChangeText={(text) => handleChange("senha", text)}
                  secureTextEntry
                  style={styles.input}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#aaa"
                />
                <Text style={styles.passwordHint}>
                  Use pelo menos 8 caracteres, incluindo 1 letra minúscula, 1
                  maiúscula, 1 número e 1 caractere especial (como @#$%)
                </Text>
              </View>
            </ScrollView>
          ) : (
            <ScrollView style={styles.formContainer}>
              <View style={styles.fieldContainer}>
                <Text style={styles.inputLabel}>DPP (Data Provável do Parto)</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={formData.dpp ? styles.dateText : styles.placeholderText}>
                    {formData.dpp || "Selecione a data"}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={dppDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    locale="pt-BR"
                    onChange={handleDateChange}
                  />
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.inputLabel}>Sexo do bebê</Text>
                <View style={styles.radioContainer}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      formData.sexoBebe === "Masculino" && styles.radioSelected,
                    ]}
                    onPress={() => handleChange("sexoBebe", "Masculino")}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        formData.sexoBebe === "Masculino" && { color: "#fff" },
                      ]}
                    >
                      Masculino
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      formData.sexoBebe === "Feminino" && styles.radioSelected,
                    ]}
                    onPress={() => handleChange("sexoBebe", "Feminino")}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        formData.sexoBebe === "Feminino" && { color: "#fff" },
                      ]}
                    >
                      Feminino
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.inputLabel}>Nome do bebê</Text>
                <TextInput
                  value={formData.nomeBebe}
                  onChangeText={(text) => handleChange("nomeBebe", text)}
                  style={styles.input}
                  placeholder="Digite o nome do bebê"
                  placeholderTextColor="#aaa"
                />
              </View>

              {/* Checkbox de aceite dos termos */}
              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setAcceptedTerms(!acceptedTerms)}
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      acceptedTerms && styles.checkboxChecked,
                    ]}
                  >
                    {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
                <View style={styles.termsTextContainer}>
                  <Text style={styles.termsText}>Li e aceito os </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setTipoSelecionado('privacy');
                      setShowTermsModal(true);
                    }}
                  >
                    <Text style={styles.termsLink}>
                      Termos de Uso e Política de Privacidade
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.continueButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.continueButtonText}>
                  {step === 1 ? "AVANÇAR" : "FINALIZAR CADASTRO"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => (step === 1 ? router.back() : setStep(1))}
              disabled={loading}
            >
              <Text style={styles.backButtonText}>VOLTAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        visible={showTermsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Termos de Uso e Política de Privacidade</Text>
            </View>

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

            {carregandoTermos ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#42CFE0" />
                <Text style={styles.loadingText}>Carregando...</Text>
              </View>
            ) : (
              <ScrollView style={styles.modalContent}>
                <Text style={styles.termsTextModal}>{conteudo}</Text>
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowTermsModal(false)}
            >
              <Text style={styles.modalButtonText}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    padding: 25,
    alignItems: "center",
    elevation: 4,
    maxHeight: "90%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#707070",
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#707070",
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
  },
  // Estilos específicos para o campo de data
  dateInput: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 16,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  dateText: {
    fontSize: 16,
    color: "#000",
  },
  placeholderText: {
    fontSize: 16,
    color: "#aaa",
  },
  passwordHint: {
    fontSize: 12,
    color: "#707070",
    marginTop: 8,
    marginBottom: 10,
    fontStyle: "italic",
    lineHeight: 16,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: "#42CFE0",
    borderColor: "#42CFE0",
  },
  radioText: {
    fontSize: 16,
    color: "#000",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
    marginBottom: 16,
  },
  checkbox: {
    marginRight: 10,
    marginTop: 2,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#42CFE0",
    borderColor: "#42CFE0",
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  termsText: {
    fontSize: 14,
    color: "#707070",
  },
  termsLink: {
    fontSize: 14,
    color: "#42CFE0",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  buttonsContainer: {
    flexDirection: "column",
    width: "100%",
  },
  backButton: {
    borderWidth: 1,
    borderColor: "#42CFE0",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  continueButton: {
    backgroundColor: "#42CFE0",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  backButtonText: {
    color: "#42CFE0",
    fontWeight: "bold",
    fontSize: 16,
  },
  continueButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "90%",
    maxHeight: "80%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#707070",
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#707070",
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    padding: 4,
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
    fontSize: 13,
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
  modalContent: {
    flex: 1,
    marginBottom: 15,
  },
  termsTextModal: {
    fontSize: 14,
    color: "#707070",
    lineHeight: 22,
    textAlign: "justify",
  },
  modalButton: {
    backgroundColor: "#42CFE0",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});