import { Stack } from 'expo-router';

export default function RechargeLayout() {

  return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="[subForm]" options={{ headerShown: false }} />
      </Stack>
  );
}