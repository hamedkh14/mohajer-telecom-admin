import { Alert } from "react-native";

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
      // Alert.alert("نتیجه ارسال", JSON.stringify(data, null, 2));
    } catch (error: any) {
      Alert.alert("خطا", error.message);
    }
  } else {
    Alert.alert("خطا", "هیچ توکنی برای ارسال موجود نیست.");
  }
}