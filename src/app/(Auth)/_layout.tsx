import {
    ImageBackground,
  } from "react-native";

export default function RootLayout() {
  return (
    <ImageBackground
    source={require("../../../assets/images/background.png")} 
    resizeMode="cover"
  ></ImageBackground>
  )
}
