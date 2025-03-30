import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from 'react-query';
import NetInfo from "@react-native-community/netinfo";

import Fonts from '@/constants/Fonts';
import Toast from 'react-native-toast-message';
import { AuthContext } from '@/context/authContext';
import { ActivityIndicator } from 'react-native-paper';
import { I18nManager, Platform, Alert } from 'react-native';
// import * as Updates from 'expo-updates';
import {registerForPushNotificationsAsync} from '@/utils/registerForPushNotificationsAsync';
import request from '@/Api/axios';
import NotificationHandler from '@/components/NotificationHandler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [authUser, setAuthUser] = useState<any>({
    isAuthenticated: false,
    user: null
  });
  const [loaded] = useFonts(Fonts);
  
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10000,
        cacheTime: 30000,
        refetchOnWindowFocus: false,
        refetchInterval: 10000,
        retry: 2,
        refetchOnReconnect: false,
      }
    }
  });

  const shouldBeRTL = true;
  if (shouldBeRTL !== I18nManager.isRTL && Platform.OS !== 'web') {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
    // Updates.reloadAsync();
  }

  

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state?.isConnected);
    });

    return () => unsubscribe();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const handleAuthUser = (val: any) => {
    setAuthUser(val)
  }

  if (isConnected === null) {
    return <ActivityIndicator size="small" color="red" />;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider value={{ authUser, handleAuthUser }}>
            <NotificationHandler>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="account" options={{ headerShown: false }} />
                <Stack.Screen name="services" options={{ headerShown: false }} />
                <Stack.Screen name="report" options={{ headerShown: false }} />
                <Stack.Screen name="customer" options={{ headerShown: false }} />
                <Stack.Screen name="subscription" options={{ headerShown: false }} />
                <Stack.Screen name="priceAdjustment" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
            </NotificationHandler>
          </AuthContext.Provider>
          <Toast />
        </QueryClientProvider>
      </ThemeProvider>
  );
}
