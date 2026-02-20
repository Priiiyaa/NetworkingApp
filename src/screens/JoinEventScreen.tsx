import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

const EVENTS = [
  {
    id: '1',
    name: 'TechCrunch Disrupt',
    location: 'San Francisco, CA',
    date: 'Oct 12–14',
    accentColor: '#15B286',
  },
  {
    id: '2',
    name: 'Web Summit Lisbon',
    location: 'Lisbon, Portugal',
    date: 'Nov 4–7',
    accentColor: '#15B286',
  },
  {
    id: '3',
    name: 'SXSW Interactive',
    location: 'Austin, TX',
    date: 'Mar 8–10',
    accentColor: '#15B286',
  },
];

const useSlideIn = (delay: number) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      delay,
      useNativeDriver: true,
    }).start();
  }, [anim, delay]);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [28, 0] });
  return { opacity: anim, transform: [{ translateY }] };
};

const JoinEventScreen = () => {
  const router = useRouter();

  const headerAnim = useSlideIn(0);
  const searchAnim = useSlideIn(120);
  const qrAnim = useSlideIn(220);
  const eventsLabelAnim = useSlideIn(320);

  const eventAnims = EVENTS.map((_, i) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const anim = useRef(new Animated.Value(0)).current;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 380,
        delay: 400 + i * 100,
        useNativeDriver: true,
      }).start();
    }, [anim]);
    const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
    return { opacity: anim, transform: [{ translateY }] };
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, headerAnim]}>
          <Text style={styles.title}>Join Event</Text>
          <Text style={styles.subtitle}>
            Find your conference or meetup to start networking.
          </Text>
        </Animated.View>

        {/* Search bar */}
        <Animated.View style={[styles.searchContainer, searchAnim]}>
          <Ionicons name="search-outline" size={18} color={COLORS.mediumGray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for an event..."
            placeholderTextColor={COLORS.mediumGray}
          />
        </Animated.View>

        {/* QR Scan card */}
        <Animated.View style={qrAnim}>
          <TouchableOpacity activeOpacity={0.88} style={styles.qrCard}>
            <View style={styles.qrIconWrapper}>
              <MaterialCommunityIcons name="qrcode-scan" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.qrTitle}>Scan Event QR Code</Text>
            <Text style={styles.qrSubtitle}>Check-in instantly at the venue</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Popular Events label */}
        <Animated.View style={eventsLabelAnim}>
          <Text style={styles.sectionLabel}>POPULAR EVENTS</Text>
        </Animated.View>

        {/* Event cards */}
        {EVENTS.map((event, i) => (
          <Animated.View key={event.id} style={eventAnims[i]}>
            <TouchableOpacity activeOpacity={0.88} style={styles.eventCard}>
              <View style={styles.eventInfo}>
                <Text style={styles.eventName}>{event.name}</Text>
                <View style={styles.eventMeta}>
                  <Ionicons name="location-outline" size={13} color={COLORS.mediumGray} />
                  <Text style={styles.eventMetaText}>{event.location}</Text>
                  <Ionicons
                    name="calendar-outline"
                    size={13}
                    color={COLORS.mediumGray}
                    style={{ marginLeft: 10 }}
                  />
                  <Text style={styles.eventMetaText}>{event.date}</Text>
                </View>
              </View>
              <View style={[styles.arrowButton, { backgroundColor: event.accentColor }]}>
                <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scroll: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.black,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.mediumGray,
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.black,
  },
  qrCard: {
    backgroundColor: '#F5F0FF',
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#E0D0FF',
  },
  qrIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EDE5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D4BEFF',
  },
  qrTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 4,
  },
  qrSubtitle: {
    fontSize: 13,
    color: COLORS.mediumGray,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.mediumGray,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 5,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventMetaText: {
    fontSize: 12,
    color: COLORS.mediumGray,
    marginLeft: 3,
  },
  arrowButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});

export default JoinEventScreen;
