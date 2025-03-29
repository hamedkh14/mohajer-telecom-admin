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
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Button from '@/components/Themes/Button';

SplashScreen.preventAutoHideAsync();

async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('⛔ دسترسی نوتیفیکیشن رد شد!', 'لطفاً در تنظیمات گوشی دسترسی نوتیفیکیشن را فعال کنید.');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    Alert.alert('✅ توکن نوتیفیکیشن:', token);
  } else {
    Alert.alert('⚠️ این قابلیت فقط روی گوشی واقعی کار می‌کند.');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

async function sendPushNotification(token: string) {
  const message = {
    to: "ExponentPushToken[dEBlWhBVoHeKjWuAj5SlH3]",
    sound: "default",
    title: "📢 پیام تستی",
    body: "این یک نوتیفیکیشن تستی از Expo است!",
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const data = await response.json();
    Alert.alert("نتیجه ارسال", JSON.stringify(data, null, 2));
  } catch (error: any) {
    Alert.alert("خطا", error.message);
  }
}

export default function RootLayout() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [authUser, setAuthUser] = useState({
    isAuthenticated: false,
    user: null
  });
  const [pushToken, setPushToken] = useState<any>('')
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
    const tokenResult = registerForPushNotificationsAsync();
    setPushToken(tokenResult);
  }, []);

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
          <Button onPress={() => {sendPushNotification(pushToken['_j']);}} text={'ارسال'} />
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
        </AuthContext.Provider>
        <Toast />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
