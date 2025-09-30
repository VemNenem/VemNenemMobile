import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';

interface SplashScreenProps {
  userName?: string;
  onComplete?: () => void;
  logoSrc: any;
}

export default function SplashHello({ 
  userName = "Julia", 
  onComplete, 
  logoSrc 
}: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.greeting}>Olá,</Text>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.welcome}>Seja bem vindo(a)!</Text>
        </Animated.View>
      </View>

      {/* Logo no rodapé */}
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Image source={logoSrc} style={styles.logo} resizeMode="contain" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#42CFE0',
    marginBottom: 8,
  },
  userName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#42CFE0',
  },
  welcome: {
    fontSize: 18,
    color: '#707070',
    marginTop: 24,
    fontWeight: '500',
  },
  logoContainer: {
    paddingBottom: 48,
  },
  logo: {
    width: 128,
    height: 128,
  },
});