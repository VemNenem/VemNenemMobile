//Splash da tela inicial com o logo

// Importa o React e o componente SplashHello
import React from "react";
import SplashHello from "../../components/SplashHello";
import { useRouter, useLocalSearchParams } from "expo-router"; // Importa os hooks do Expo Router para navegação e leitura de parâmetros

// Tela que exibe a animação ou mensagem de boas-vindas
export default function SplashHelloScreen() {
  const router = useRouter(); // Hook para navegação entre telas
  const { userName } = useLocalSearchParams(); // Pega o nome do usuário passado por parâmetro

  return (
    <SplashHello
      userName={userName as string}
      logoSrc={require("../../../assets/images/logo.png")}

      // Quando a animação termina, redireciona para a tela inicial
      onComplete={() => {
        router.replace("/(main)/inicio");
      }}
    />
  );
}
