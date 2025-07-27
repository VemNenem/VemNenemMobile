import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ImageBackground,
    ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

export default function Cadastro() {
    const router = useRouter();
    const [step, setStep] = useState(1); 
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        dpp: "",
        sexoBebe: "",
        nomeBebe: "",
        nomePai: "",
    });

    const handleChange = (name: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (step === 1) {
            setStep(2); 
        } else {
            router.push("/(main)/inicio");
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
                    <Text style={styles.title}>Cadastro</Text>

                    {step === 1 ? (
                        <ScrollView style={styles.formContainer}>
                            <Text style={styles.inputLabel}>Nome</Text>
                            <TextInput
                                value={formData.nome}
                                onChangeText={(text) => handleChange("nome", text)}
                                style={styles.input}
                                placeholder="Digite seu nome"
                                placeholderTextColor="#707070"
                            />
                            
                            <Text style={styles.inputLabel}>E-mail</Text>
                            <TextInput
                                value={formData.email}
                                onChangeText={(text) => handleChange("email", text)}
                                keyboardType="email-address"
                                style={styles.input}
                                placeholder="Digite seu e-mail"
                                placeholderTextColor="#707070"
                            />

                            <Text style={styles.inputLabel}>Senha</Text>
                            <TextInput
                                value={formData.senha}
                                onChangeText={(text) => handleChange("senha", text)}
                                secureTextEntry
                                style={styles.input}
                                placeholder="Digite sua senha"
                                placeholderTextColor="#707070"
                            />

                            <Text style={styles.passwordHint}>
                                Use pelo menos 8 caracteres, incluindo 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial (como @#$%)
                            </Text>
                        </ScrollView>
                    ) : (
                        <ScrollView style={styles.formContainer}>
                            <Text style={styles.inputLabel}>DPP (Data Provável do Parto)</Text>
                            <TextInput
                                value={formData.dpp}
                                onChangeText={(text) => handleChange("dpp", text)}
                                style={styles.input}
                                placeholder="Ex: 30/06/2025"
                                placeholderTextColor="#707070"
                            />

                            <Text style={styles.inputLabel}>Sexo do bebê</Text>
                            <View style={styles.radioContainer}>
                                <TouchableOpacity
                                    style={[styles.radioButton, formData.sexoBebe === "Masculino" && styles.radioSelected]}
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
                                    style={[styles.radioButton, formData.sexoBebe === "Feminino" && styles.radioSelected]}
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

                            <Text style={styles.inputLabel}>Nome do bebê</Text>
                            <TextInput
                                value={formData.nomeBebe}
                                onChangeText={(text) => handleChange("nomeBebe", text)}
                                style={styles.input}
                                placeholder="Digite o nome do bebê"
                                placeholderTextColor="#707070"
                            />

                        </ScrollView>
                    )}

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.continueButton} onPress={handleSubmit}>
                            <Text style={styles.continueButtonText}>
                                {step === 1 ? "AVANÇAR" : "FINALIZAR CADASTRO"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => (step === 1 ? router.back() : setStep(1))}
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
    step: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#E0E0E0",
        justifyContent: "center",
        alignItems: "center",
    },
    activeStep: {
        backgroundColor: "#42CFE0",
    },
    stepText: {
        color: "#fff",
        fontWeight: "bold",
    },
    stepLine: {
        height: 2,
        width: 40,
        backgroundColor: "#E0E0E0",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#42CFE0",
        marginBottom: 15,
        alignSelf: "flex-start",
    },
    formContainer: {
        width: "100%",
        marginBottom: 20,
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
        marginBottom: 16,
        fontSize: 16,
        color: "#000",
    },
    passwordHint: {
        fontSize: 12,
        color: "#707070",
        marginTop: -8,
        marginBottom: 10,
        fontStyle: "italic",
    },
    radioContainer: {
        flexDirection: "row",
        marginBottom: 16,
    },
    radioButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        marginRight: 10,
    },
    radioSelected: {
        backgroundColor: "#42CFE0",
        borderColor: "#42CFE0",
    },
    radioText: {
        color: "#707070",
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
    },
    continueButton: {
        backgroundColor: "#42CFE0",
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 30,
        alignItems: "center",
        marginBottom: 10, 
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
