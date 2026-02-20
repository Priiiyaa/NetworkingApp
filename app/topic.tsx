import { Stack } from 'expo-router';
import { COLORS } from '../src/constants/colors';
import TopicScreen from '../src/screens/TopicScreen';

export default function Page() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerBackTitleVisible: false,
          headerStyle: { backgroundColor: COLORS.white },
          headerTintColor: COLORS.darkGray,
        }}
      />
      <TopicScreen />
    </>
  );
}
