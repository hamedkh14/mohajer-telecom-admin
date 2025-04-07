import request from '@/Api/axios';
import { useAuth } from '@/context/authContext';
import { registerForPushNotificationsAsync } from '@/utils/registerForPushNotificationsAsync';
import React, { useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native';
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NotificationHandler = ({children} : {children: React.ReactNode}) => {
  const [pushToken, setPushToken] = useState<any>('')
  const {authUser} = useAuth()
  const notificationListener = useRef<Notifications.EventSubscription | undefined>();
  const responseListener = useRef<Notifications.EventSubscription | undefined>();

  useEffect(() => {
    if(authUser.isAuthenticated || authUser.user) {
      registerForPushNotificationsAsync().then(token => {
        if(token) {
          try {
            request.patch(`/collections/users/records/${(authUser?.user?.id)}`, {pushToken: token});
            setPushToken(token)
            // Alert.alert('توکن با موفقیت ذخیره شد!');
          } catch (error) {
            Alert.alert('خطا', 'خطا در ذخیره توکن!'); 
          }
        }
      });
    }

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Foreground Notification:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("User clicked notification:", response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [authUser]);
  return children
}

export default NotificationHandler