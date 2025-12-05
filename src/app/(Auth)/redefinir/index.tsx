//Tela de redefinição de tela

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
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { resetPassword } from '@/src/service/esqueciSenhaService';

export default function RedefinirSenha() {
    const router = useRouter(); // Hook de navegação
    const [token, setToken] = useState(""); // Armazena o código de verificação
    const [password, setPassword] = useState(""); // Armazena a nova senha
    const [confirmPassword, setConfirmPassword] = useState(""); // Confirmação da nova senha
    const [loading, setLoading] = useState(false); // Controle de carregamento
    const [showPassword, setShowPassword] = useState(false); // Mostrar/ocultar senha
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Mostrar/ocultar confirmação

    // Valida regras de segurança da senha
    const validatePassword = (password: string): { isValid: boolean; message?: string } => {
        if (password.length < 8) {
            return { isValid: false, message: "A senha deve ter no mínimo 8 caracteres" };
        }

        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasLowercase) {
            return { isValid: false, message: "A senha deve conter pelo menos uma letra minúscula" };
        }

        if (!hasUppercase) {
            return { isValid: false, message: "A senha deve conter pelo menos uma letra maiúscula" };
        }

        if (!hasSpecialChar) {
            return { isValid: false, message: "A senha deve conter pelo menos um caractere especial (!@#$%^&*)" };
        }

        return { isValid: true };
    };

    // Função para redefinir a senha
    const handleRedefinir = async () => {
        if (!token.trim()) {
            Alert.alert("Atenção", "Por favor, insira o código de verificação");
            return;
        }

        if (!password.trim()) {
            Alert.alert("Atenção", "Por favor, insira a nova senha");
            return;
        }

        if (!confirmPassword.trim()) {
            Alert.alert("Atenção", "Por favor, confirme a nova senha");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Atenção", "As senhas não coincidem");
            return;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            Alert.alert("Atenção", passwordValidation.message || "Senha inválida");
            return;
        }

        setLoading(true);
        try {
            // Chama a service de redefinição de senha
            const response = await resetPassword({
                resetPasswordToken: token.trim(),
                password: password,
                confirmPassword: confirmPassword,
            });

            if (response.success) {
                // Exibe sucesso e volta para a tela inicial
                Alert.alert(
                    "Sucesso",
                    response.message || "Senha redefinida com sucesso!",
                    [
                        {
                            text: "OK",
                            onPress: () => router.replace("/"),
                        },
                    ]
                );
                setToken("");
                setPassword("");
                setConfirmPassword("");
            } else {
                Alert.alert("Erro", response.message || "Erro ao redefinir senha");
            }
        } catch (error) {
            console.error("Erro ao redefinir senha:", error);
            Alert.alert("Erro", "Erro ao redefinir senha. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require("../../../../assets/images/background.png")}
            style={styles.background}
            resizeMode="cover"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        <Image source={require("../../../../assets/images/logo.png")} style={styles.logo} />

                        <View style={styles.card}>
                            <Text style={styles.title}>Redefinir senha</Text>

                            <Text style={styles.description}>
                                Digite o código recebido por email e sua nova senha
                            </Text>

                            {/* Input de código */}
                            <Text style={styles.inputLabel}>Código de verificação</Text>
                            <TextInput
                                placeholder="Digite o código"
                                style={styles.input}
                                placeholderTextColor="#707070"
                                value={token}
                                onChangeText={setToken}
                                editable={!loading}
                                autoCapitalize="characters"
                                autoCorrect={false}
                                maxLength={6}
                            />

                            {/* Input */}
                            <Text style={styles.inputLabel}>Nova senha</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    placeholder="Digite sua nova senha"
                                    secureTextEntry={!showPassword}
                                    style={styles.passwordInput}
                                    placeholderTextColor="#707070"
                                    value={password}
                                    onChangeText={setPassword}
                                    editable={!loading}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                {/* Botão para mostrar/ocultar senha */}
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Text style={styles.eyeText}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Regras de senha */}
                            <View style={styles.regrasContainer}>
                                <Text style={styles.regrasText}>• Use pelo menos 8 caracteres</Text>
                                <Text style={styles.regrasText}>
                                    • Inclua 1 letra minúscula, 1 maiúscula e 1 caractere especial
                                </Text>
                                <Text style={styles.regrasText}>• Use uma senha forte</Text>
                            </View>

                            {/* Input*/}
                            <Text style={styles.inputLabel}>Confirmar nova senha</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    placeholder="Confirme sua nova senha"
                                    secureTextEntry={!showConfirmPassword}
                                    style={styles.passwordInput}
                                    placeholderTextColor="#707070"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    editable={!loading}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                {/* Botão para mostrar/ocultar confirmação */}
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Text style={styles.eyeText}>{showConfirmPassword ? "👁️" : "👁️‍🗨️"}</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Botão de redefinir */}
                            <TouchableOpacity
                                style={[styles.continueButton, loading && styles.buttonDisabled]}
                                onPress={handleRedefinir}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.continueButtonText}>REDEFINIR SENHA</Text>
                                )}
                            </TouchableOpacity>

                            {/* Botão de voltar */}
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => router.back()}
                                disabled={loading}
                            >
                                <Text style={styles.backButtonText}>VOLTAR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

//Estilos
const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
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
        marginBottom: 20,
        fontSize: 16,
        color: "#000",
    },
    passwordContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        marginBottom: 10,
    },
    passwordInput: {
        flex: 1,
        height: 48,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 16,
        paddingRight: 50,
        fontSize: 16,
        color: "#000",
    },
    regrasContainer: {
        marginBottom: 20,
        width: "100%",
    },
    regrasText: {
        fontSize: 12,
        color: "#42CFE0",
        marginBottom: 4,
    },
    eyeIcon: {
        position: "absolute",
        right: 16,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 8,
    },
    eyeText: {
        fontSize: 20,
    },
    continueButton: {
        backgroundColor: "#42CFE0",
        borderRadius: 10,
        width: "100%",
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 10,
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
