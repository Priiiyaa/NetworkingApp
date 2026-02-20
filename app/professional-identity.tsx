import { Stack } from 'expo-router';
import ProfessionalIdentity from '../src/screens/ProfessionalIdentity';

export default function Page() {
	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<ProfessionalIdentity />
		</>
	);
}
