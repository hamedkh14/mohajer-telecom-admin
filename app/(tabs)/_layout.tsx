import Colors from '@/constants/Colors';
import { useAuth } from '@/context/authContext';
import { Tabs } from 'expo-router';
import React from 'react';
import {WalletIcon, HomeIcon, BriefcaseIcon, UsersIcon} from 'react-native-heroicons/outline';


export default function TabLayout() {
  const {authUser} = useAuth()

  return (
    <Tabs
      initialRouteName='index'
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
      }}
    >
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
        name="requests"
        options={{
          title: 'Requests',
          tabBarLabel: 'درخواست ها',
          tabBarIcon: ({ color }) => (
            <WalletIcon size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="customer"
        options={{
          title: 'Cusotmer',
          tabBarLabel: 'مشتریان',
          tabBarIcon: ({ color }) => (
            <UsersIcon size={24} color={color} />
          ),
          href: (authUser?.user?.role === 'customer' ? null : '/(tabs)/customer')
        }}
      />
    </Tabs>
  );
}
