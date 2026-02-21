import { Stack } from 'expo-router';
import PersonalityTraits from '../src/screens/PersonalityTraits';

export default function Page() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PersonalityTraits />
    </>
  );
}
