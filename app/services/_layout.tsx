import { Stack } from 'expo-router';

export default function ServicesLayout() {

  return (
      <Stack>
        <Stack.Screen name="recharge" options={{ headerShown: false }} />
        <Stack.Screen name="internet" options={{ headerShown: false }} />
        <Stack.Screen name="bargarar" options={{ headerShown: false }} />
        <Stack.Screen name="almas" options={{ headerShown: false }} />
        <Stack.Screen name="uc-pubg" options={{ headerShown: false }} />
        <Stack.Screen name="remittances" options={{ headerShown: false }} />
        <Stack.Screen name="[...serviceForm]" options={{ headerShown: false }} />
      </Stack>
  );
}