import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedOption from '../components/AnimatedOption';
import { COLORS } from '../constants/colors';

const ProfessionalIdentity = () => {
  const router = useRouter();

  const items = [
    'Current role and company',
    'Past experience and skills',
    'Education and interests',
    'Public profile information',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <View style={styles.appIcon}>
            <Ionicons name="person-outline" size={36} color={COLORS.white} />
          </View>
        </View>

        <Text style={styles.title}>Professional Identity</Text>
        <Text style={styles.subtitle}>
          Import your professional history to let our AI find your perfect matches.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardHeading}>WHAT WE SYNC</Text>
          {items.map((it, idx) => (
            <AnimatedOption key={it} index={idx} style={styles.row}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={styles.rowText}>{it}</Text>
            </AnimatedOption>
          ))}
        </View>

        <TouchableOpacity style={styles.connectButton} onPress={() => router.push('/primary-goal') }>
          <View style={styles.connectInner}>
            <Ionicons name="logo-linkedin" size={20} color={COLORS.white} />
            <Text style={styles.connectText}>  Connect LinkedIn</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.privacy}>Your data is encrypted and never sold.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  iconWrap: {
    marginBottom: 18,
  },
  appIcon: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#17B890',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.black,
    marginTop: 6,
  },
  subtitle: {
    color: COLORS.mediumGray,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
    paddingHorizontal: 12,
    lineHeight: 20,
  },
  card: {
    width: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeading: {
    color: COLORS.darkGray,
    fontWeight: '700',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowText: {
    color: COLORS.darkGray,
    marginLeft: 10,
  },
  connectButton: {
    width: '90%',
    backgroundColor: '#15B286',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  connectInner: { flexDirection: 'row', alignItems: 'center' },
  connectText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  privacy: {
    color: '#9A9A9A',
    marginTop: 12,
    fontSize: 12,
  },
});

export default ProfessionalIdentity;
