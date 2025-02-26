import Colors from '@/constants/Colors';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HomeIcon, UsersIcon, WalletIcon } from 'react-native-heroicons/outline';

export default function TabLayout() {

  return (
    <Tabs
    screenOptions={{
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.whiteAlpha,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.elementBackground,
          borderTopWidth: 0,
          height: 64,
          elevation: 0
        },
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
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <HomeIcon size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
          tabBarLabel: 'درخواست ها',
          tabBarIcon: ({ color }) => (
            <WalletIcon size={24} color={color} />
          ),
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="customer"
        options={{
          title: 'Customer',
          tabBarLabel: 'مشتریان',
          tabBarIcon: ({ color }) => (
            <UsersIcon size={24} color={color} />
          ),
          headerShown: false
        }}
      />
    </Tabs>
  );
}