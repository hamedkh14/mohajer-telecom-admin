import { Stack } from 'expo-router';

export default function ReportLayout() {

  return (
      <Stack>
        <Stack.Screen name="[userId]" options={{ headerShown: false }} />
      </Stack>
  );
}