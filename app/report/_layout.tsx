import { Stack } from 'expo-router';

export default function ReportLayout() {

  return (
      <Stack>
        <Stack.Screen name="[serviceRequestReport]" options={{ headerShown: false }} />
        <Stack.Screen name="[transactionReport]" options={{ headerShown: false }} />
      </Stack>
  );
}