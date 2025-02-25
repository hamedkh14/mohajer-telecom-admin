import { Stack } from 'expo-router';

export default function RemittancesServicesLayout() {

  return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="addRemittances" options={{ headerShown: false }} />
      </Stack>
  );
}