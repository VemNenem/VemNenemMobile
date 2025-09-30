import { Slot } from 'expo-router';
import SplashProvider from '../components/SplashProvider';

export default function RootLayout() {
  return (
    <SplashProvider>
      <Slot />
    </SplashProvider>
  );
}