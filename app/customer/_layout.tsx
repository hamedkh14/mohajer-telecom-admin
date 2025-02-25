import { Stack } from 'expo-router';

export default function CustomerLayout() {

  return (
      <Stack>
        <Stack.Screen name="[...userForm]" options={{ headerShown: false }} />
        <Stack.Screen name="report" options={{ headerShown: false }} />
      </Stack>
  );
}