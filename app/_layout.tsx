import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide the header for all screens
        contentStyle: { backgroundColor: '#fff' }, // Set a default background color
        animation: 'fade_from_bottom', // Default animation for screen transitions
      }}
    />
  );
}
