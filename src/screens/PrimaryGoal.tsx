import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedOption from '../components/AnimatedOption';
import { COLORS } from '../constants/colors';

const OPTIONS = [
  'Finding potential investors',
  'Meeting technical co-founders',
  'Exploring new job opportunities',
  'Just networking casually',
];

const PrimaryGoal = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>What's your primary goal today?</Text>
        {/** Animated option items */}
        <FlatList
          data={OPTIONS}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => {
            const active = selected === index;

            return (
              <AnimatedOption index={index} style={{ marginBottom: 12 }}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setSelected(index)}
                  style={[styles.option, active && styles.optionActive]}
                >
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>{item}</Text>
                </TouchableOpacity>
              </AnimatedOption>
            );
          }}
        />
        <TouchableOpacity
          style={[styles.continueButton, selected === null && styles.continueDisabled]}
          onPress={() => router.push('/topic')}
          disabled={selected === null}
        >
          <Text style={styles.continueText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 18,
  },
  list: {
    paddingBottom: 24,
  },
  option: {
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    backgroundColor: COLORS.white,
    marginBottom: 12,
  },
  optionActive: {
    backgroundColor: COLORS.gray,
    borderColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.darkGray,
    fontSize: 16,
  },
  optionTextActive: {
    color: COLORS.black,
    fontWeight: '600',
  },
  continueButton: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueDisabled: {
    opacity: 0.6,
  },
  continueText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PrimaryGoal;
