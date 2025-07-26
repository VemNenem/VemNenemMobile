import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [tipo, setTipo] = useState("mamãe");

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} />

        <View style={styles.card}>
          <Text style={styles.title}>Bem vindo(a)!</Text>

          <Text style={styles.inputLabel}>E-mail</Text>
          <TextInput
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor="#707070"
          />
          
          <Text style={styles.inputLabel}>Senha</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
              style={styles.passwordInput}
              placeholderTextColor="#707070"
            />
            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
              <Ionicons name={mostrarSenha ? "eye-off" : "eye"} size={24} color="gray" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => router.push("/(Auth)/recuperar")}>
            <Text style={styles.link}>Esqueci a senha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/(main)/inicio")}>
            <Text style={styles.loginButtonText}>ENTRAR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerButton} onPress={() => router.push("/(Auth)/cadastro")}>
            <Text style={styles.registerButtonText}>CADASTRAR</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(Auth)/termos')}>
            <Text style={styles.termsText}>
              Termos de Uso e Política de Privacidade
            </Text>
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
  switchContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 4,
  },
  switchButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  switchText: {
    color: "#000",
  },
  activeSwitch: {
    backgroundColor: "#42CFE0",
  },
  activeSwitchText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 4,
    paddingTop: 30,
    paddingBottom: 30,
  },
  forgotPasswordButton: {
    alignSelf: "flex-start",
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 20,
    textAlign: "center",
    color: "#707070"
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#707070",
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    marginBottom: 16,
    fontSize: 16,
    color: "#000",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  link: {
    color: "#707070",
    alignSelf: "flex-end",
    marginBottom: 20,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#42CFE0",
    borderRadius: 10,
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  registerButton: {
    borderWidth: 1,
    borderColor: "#42CFE0",
    borderRadius: 10,
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  registerButtonText: {
    color: "#42CFE0",
    fontWeight: "bold",
  },
  termsText: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});
