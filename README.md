# VemNenem Mobile

Aplicação mobile do VemNenem, desenvolvida com React Native e Expo para plataformas iOS e Android.

## Sobre o Projeto

Este é o aplicativo mobile do projeto VemNenem, construído com Expo, uma plataforma que simplifica o desenvolvimento React Native oferecendo um conjunto robusto de ferramentas e bibliotecas nativas prontas para uso.

### Principais Tecnologias

**Expo**: Framework que fornece APIs nativas prontas para uso, ferramentas de desenvolvimento e sistema de hot reload para agilizar o desenvolvimento.

**React Native**: Framework para construir aplicações nativas usando React. Os componentes são convertidos em componentes nativos reais (UIView no iOS, View no Android), proporcionando performance nativa.

**TypeScript**: Linguagem que adiciona tipagem estática ao JavaScript, melhorando a qualidade do código e experiência de desenvolvimento.

## Requisitos

- Node.js 18 ou superior
- NPM ou Yarn
- Dispositivo físico com app Expo Go instalado, ou
- Emulador Android Studio (Android) / Xcode (iOS)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/VemNenem/VemNenemMobile.git
cd VemNenemMobile
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` com a URL da API:
```env
API_URL=http://localhost:1337/api
```

## Executando o Projeto

Inicie o servidor de desenvolvimento:

```bash
npx expo start
```

Após iniciar, você verá um QR code no terminal com várias opções de execução:

### Opção 1: Dispositivo Físico (Recomendado)

1. Instale o app **Expo Go** no seu celular:
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android - Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Escaneie o QR code:
   - **iOS**: Use a câmera nativa
   - **Android**: Use o app Expo Go

3. O aplicativo será carregado automaticamente no seu dispositivo

### Opção 2: Emulador Android

```bash
npx expo start --android
```

Requer Android Studio instalado e configurado com um emulador.

### Opção 3: Simulador iOS (apenas macOS)

```bash
npx expo start --ios
```

Requer Xcode instalado.

## Desenvolvimento

### Hot Reload

O Expo oferece hot reload automático. Qualquer alteração no código será refletida instantaneamente no aplicativo sem precisar recarregar.

### Debug

Abra o menu de desenvolvedor no dispositivo:
- **iOS**: Sacuda o dispositivo ou pressione Cmd + D (simulador)
- **Android**: Sacuda o dispositivo ou pressione Cmd/Ctrl + M

### Limpar Cache

Se encontrar problemas, limpe o cache:
```bash
npx expo start --clear
```

## Integração com Backend

O aplicativo se comunica com o backend Strapi através da API REST configurada na variável de ambiente `API_URL`. As requisições são feitas através da camada de services.

## Recursos

- [Documentação do Expo](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Tutorial Expo](https://docs.expo.dev/tutorial/introduction/)
