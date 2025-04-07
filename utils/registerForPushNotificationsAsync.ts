import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from "expo-constants";
import { Alert, Platform } from 'react-native';

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
      // Alert.alert('✅ توکن نوتیفیکیشن:', token);
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