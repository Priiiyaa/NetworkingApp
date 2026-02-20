import { Stack } from 'expo-router';
import { COLORS } from '../src/constants/colors';
import JoinEventScreen from '../src/screens/JoinEventScreen';

export default function Page() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <JoinEventScreen />
    </>
  );
}
