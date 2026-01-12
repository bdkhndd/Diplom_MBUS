import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon'; 
import { Ionicons } from '@expo/vector-icons'; 
import { Colors } from '@/constants/Colors'; 
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  
   return (
    <Tabs
      screenOptions={{
        
                headerShown: false, 
                tabBarActiveTintColor: '#3b5998', 
                tabBarInactiveTintColor: '#999',    
                tabBarStyle: {
                    backgroundColor: '#fff', 
                    borderTopWidth: 0,
                    elevation: 0, 
                },
            }}
        >
            
            <Tabs.Screen 
                name="index" 
                options={{
                    headerShown: false, 
                    title: 'Нүүр', 
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
        name="calculator" 
        options={{
          title: 'Тооцоолуур', 
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'calculator' : 'calculator-outline'} color={color} /> 
          ),
          // Calculatoriin header tohiruulh
          headerShown: true, 
          headerTitle: 'Тооцоолуур',
          headerTitleStyle: { fontWeight: 'bold' },
          headerStyle: { backgroundColor: Colors.primary }, 
          headerTintColor: Colors.white,
        }}
      />
      

            <Tabs.Screen
                name="scholarship/index" 
                options={{
                    title: 'Тэтгэлэг',
                    tabBarStyle: { display: 'none' }, 
                }}
            />
            <Tabs.Screen
        name="contactinfo" // Энэ нэр app/(tabs)/contactinfo.tsx файлтай яг таарах ёстой
        options={{
          title: 'Холбоо барих',
          headerShown: false, // contactinfo.tsx дотор Stack.Screen-ээр өөрөө удирдаж байгаа тул энд false байх нь зөв
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="call" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
    );
}