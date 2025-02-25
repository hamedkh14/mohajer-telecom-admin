import { Stack } from 'expo-router';

export default function UcPubgServicesLayout() {

  return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
  );
}