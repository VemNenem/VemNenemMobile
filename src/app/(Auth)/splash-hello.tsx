import React from "react";
import SplashHello from "../../components/SplashHello";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function SplashHelloScreen() {
  const router = useRouter();
  const { userName } = useLocalSearchParams();

  return (
    <SplashHello
      userName={userName as string}
      logoSrc={require("../../../assets/images/logo.png")}
      onComplete={() => {
        router.replace("/(main)/inicio");
      }}
    />
  );
}
