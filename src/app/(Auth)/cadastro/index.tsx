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
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createClient } from "../../../service/cadastroService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TEMP_FORM_KEY = '@cadastro_temp_form';

export default function Cadastro() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
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

  // Carrega dados salvos temporariamente ao montar o componente
  useEffect(() => {
    loadTempFormData();
  }, []);

  // Restaura o step quando voltar dos termos
  useEffect(() => {
    if (params.step) {
      setStep(Number(params.step));
    }
  }, [params.step]);

  // Salva dados temporariamente sempre que formData mudar
  useEffect(() => {
    saveTempFormData();
  }, [formData]);

  const loadTempFormData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(TEMP_FORM_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        // Se tem DPP, atualiza o date picker também
        if (parsedData.dpp) {
          const [day, month, year] = parsedData.dpp.split("/");
          setDppDate(new Date(Number(year), Number(month) - 1, Number(day)));
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados temporários:", error);
    }
  };

  const saveTempFormData = async () => {
    try {
      await AsyncStorage.setItem(TEMP_FORM_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error("Erro ao salvar dados temporários:", error);
    }
  };

  const clearTempFormData = async () => {
    try {
      await AsyncStorage.removeItem(TEMP_FORM_KEY);
    } catch (error) {
      console.error("Erro ao limpar dados temporários:", error);
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

      // Validação da senha
      const senhaValida = validarSenha(formData.senha);
      if (!senhaValida.valida) {
        Alert.alert("Senha inválida", senhaValida.mensagem);
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
          // Limpa os dados temporários após cadastro bem-sucedido
          await clearTempFormData();
          Alert.alert(
            "Sucesso",
            "Cadastro realizado com sucesso! Faça login para acessar o aplicativo.",
            [
              {
                text: "OK",
                onPress: () => router.push("/"),
              },
            ]
          );
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

  const validarSenha = (senha: string): { valida: boolean; mensagem: string } => {
    if (senha.length < 8) {
      return {
        valida: false,
        mensagem: "A senha deve ter pelo menos 8 caracteres",
      };
    }

    if (!/[a-z]/.test(senha)) {
      return {
        valida: false,
        mensagem: "A senha deve conter pelo menos uma letra minúscula",
      };
    }

    if (!/[A-Z]/.test(senha)) {
      return {
        valida: false,
        mensagem: "A senha deve conter pelo menos uma letra maiúscula",
      };
    }

    if (!/[0-9]/.test(senha)) {
      return {
        valida: false,
        mensagem: "A senha deve conter pelo menos um número",
      };
    }

    if (!/[@#$%&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
      return {
        valida: false,
        mensagem: "A senha deve conter pelo menos um caractere especial (@#$%&*...)",
      };
    }

    return {
      valida: true,
      mensagem: "",
    };
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
                    onPress={() => router.push({
                      pathname: '/(Auth)/termos',
                      params: { returnStep: '2' }
                    })}
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
              onPress={async () => {
                if (step === 1) {
                  // Limpa dados temporários ao sair do cadastro
                  await clearTempFormData();
                  router.back();
                } else {
                  setStep(1);
                }
              }}
              disabled={loading}
            >
              <Text style={styles.backButtonText}>VOLTAR</Text>
            </TouchableOpacity>
          </View>
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
});