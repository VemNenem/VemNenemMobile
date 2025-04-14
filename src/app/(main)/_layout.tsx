import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: '#707070',
        tabBarActiveTintColor: '#42CFE0',
        headerStyle: {
          backgroundColor: 'white',
        },
        headerShadowVisible: true,
        headerTintColor: '#42CFE0',
        tabBarStyle: {
          backgroundColor: 'white',
        },

      }}
    >
      <Tabs.Screen
        name="blog/index"
        options={{
          title: 'Blog',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'newspaper-outline' : 'newspaper-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="inicio/index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-outline' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="ferramentas/index"
        options={{
          title: 'Ferramentas',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'briefcase-outline' : 'briefcase-outline'} color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
