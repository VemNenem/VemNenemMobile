//Layout padrão do grupo (Auth)

// Importa o componente Slot do Expo Router
// O Slot é usado para renderizar as rotas filhas dentro do layout principal
import { Slot } from 'expo-router';

// Componente principal de layout da aplicação
export default function RootLayout() {
  // O Slot funciona como um espaço reservado
  // onde as páginas (rotas) serão exibidas dinamicamente
  return <Slot />;
}
