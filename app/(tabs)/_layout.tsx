import Colors from '@/constants/Colors';
import { Tabs } from 'expo-router';
import React from 'react';
import { HomeIcon } from 'react-native-heroicons/outline';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.elementBackground,
          borderTopWidth: 0,
          height: 64,
          elevation: 0
        },
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.whiteAlpha,
        tabBarIconStyle: {
          marginTop: 5
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'خانه',
          tabBarIcon: ({ color }) => (
            <HomeIcon size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore'
        }}
      />
    </Tabs>
  );
}
