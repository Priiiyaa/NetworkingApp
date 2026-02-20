import { Stack } from 'expo-router';
import { COLORS } from '../src/constants/colors';
import PrimaryGoal from '../src/screens/PrimaryGoal';

export default function Page() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerBackTitle: 'Back',
          headerBackTitleVisible: true,
          headerStyle: { backgroundColor: COLORS.white },
          headerTintColor: COLORS.darkGray,
        }}
      />
      <PrimaryGoal />
    </>
  );
}
