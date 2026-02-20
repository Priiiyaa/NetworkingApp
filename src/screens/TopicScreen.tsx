import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedOption from '../components/AnimatedOption';
import { COLORS } from '../constants/colors';

const OPTIONS = [
  'Artificial Intelligence & LLMs',
  'Web3 & Blockchain',
  'SaaS Growth Strategies',
  'Product Design & UX',
];

const TopicScreen = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Which topic excites you most?</Text>

          <FlatList
            data={OPTIONS}
            keyExtractor={(i) => i}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => {
                const active = selected === index;

                return (
                  <AnimatedOption index={index} style={{ marginBottom: 12 }}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={[styles.option, active && styles.optionActive]}
                      onPress={() => setSelected(index)}
                    >
                      <Text style={[styles.optionText, active && styles.optionTextActive]}>{item}</Text>
                    </TouchableOpacity>
                  </AnimatedOption>
                );
            }}
          />

        <TouchableOpacity
          style={[styles.continueButton, selected === null && styles.continueDisabled]}
          onPress={() => selected !== null && router.push('/conversation-style')}
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
  list: { paddingBottom: 24 },
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
    fontWeight: '700',
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
  continueDisabled: { opacity: 0.6 },
  continueText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});

export default TopicScreen;
