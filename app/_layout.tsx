import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, useSegments, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { auth } from '../src/config/firebase';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authReady) return;
    const inAuthGroup = segments[0] === undefined || segments[0] === 'sign-up';
    if (!user && !inAuthGroup) {
      router.replace('/');
    }
  }, [user, authReady, segments]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="professional-identity" options={{ headerShown: false }} />
      <Stack.Screen name="primary-goal" options={{ headerShown: false }} />
      <Stack.Screen name="personality-traits" options={{ headerShown: false }} />
      <Stack.Screen name="topic" options={{ headerShown: false }} />
      <Stack.Screen name="conversation-style" options={{ headerShown: false }} />
      <Stack.Screen name="join-event" options={{ headerShown: false }} />
      <Stack.Screen name="qr-scanner" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
    </Stack>
  );
}
