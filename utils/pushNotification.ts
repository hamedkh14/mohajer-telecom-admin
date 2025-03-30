import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from "expo-constants";
import { Alert, Platform } from 'react-native';

const endpoint = '/collections/users/records'

export async function registerForPushNotificationsAsync() {
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

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      Alert.alert('⛔ خطا', 'Project ID not found!');
      return
    }

    try {
      token =  (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      Alert.alert('✅ توکن نوتیفیکیشن:', token);
    } catch (error) {
      Alert.alert('⛔ خطا', 'خطا در دریافت توکن نوتیفیکیشن!');
    }
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

export async function sendPushNotification({
  pushTokens = [], 
  title = "📢", 
  body = "این یک نوتیفیکیشن تستی از Expo است!"
} : {
  pushTokens?: string[], 
  title?: string, 
  body?: string
}) {
  let tokens = pushTokens;

  if (tokens.length) {
    const message = {
      to: tokens,
      sound: "default",
      title,
      body,
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
  } else {
    Alert.alert("خطا", "هیچ توکنی برای ارسال موجود نیست.");
  }
}