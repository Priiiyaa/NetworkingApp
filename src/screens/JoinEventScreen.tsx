import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { signOut, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../config/firebase';
import { COLORS } from '../constants/colors';

const ALL_EVENTS = [
  { id: '1', name: 'TechCrunch Disrupt', location: 'San Francisco, CA', date: 'Oct 12–14' },
  { id: '2', name: 'Web Summit Lisbon', location: 'Lisbon, Portugal', date: 'Nov 4–7' },
  { id: '3', name: 'SXSW Interactive', location: 'Austin, TX', date: 'Mar 8–10' },
  { id: '4', name: 'Y Combinator Demo Day', location: 'Mountain View, CA', date: 'Apr 2–3' },
  { id: '5', name: 'AWS re:Invent', location: 'Las Vegas, NV', date: 'Dec 1–5' },
  { id: '6', name: 'ProductHunt Global', location: 'Online', date: 'Jan 15' },
  { id: '7', name: 'CES 2025', location: 'Las Vegas, NV', date: 'Jan 7–10' },
  { id: '8', name: 'Founders Summit', location: 'New York, NY', date: 'Sep 20–21' },
];

const POPULAR_COUNT = 3;

type Tab = 'events' | 'registered' | 'profile';

const useSlideIn = (delay: number) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 400, delay, useNativeDriver: true }).start();
  }, [anim, delay]);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [28, 0] });
  return { opacity: anim, transform: [{ translateY }] };
};

const EventCard = ({ event }: { event: typeof ALL_EVENTS[0] }) => (
  <TouchableOpacity activeOpacity={0.88} style={styles.eventCard}>
    <View style={styles.eventInfo}>
      <Text style={styles.eventName}>{event.name}</Text>
      <View style={styles.eventMeta}>
        <Ionicons name="location-outline" size={13} color={COLORS.mediumGray} />
        <Text style={styles.eventMetaText}>{event.location}</Text>
        <Ionicons name="calendar-outline" size={13} color={COLORS.mediumGray} style={{ marginLeft: 10 }} />
        <Text style={styles.eventMetaText}>{event.date}</Text>
      </View>
    </View>
    <View style={styles.arrowButton}>
      <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
    </View>
  </TouchableOpacity>
);

const JoinEventScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('events');
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<typeof ALL_EVENTS>([]);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const headerAnim = useSlideIn(0);
  const searchAnim = useSlideIn(120);
  const qrAnim = useSlideIn(220);
  const eventsLabelAnim = useSlideIn(320);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    setUserEmail(user.email ?? '');

    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      const name = data?.linkedin?.name || data?.displayName || user.email?.split('@')[0] || 'User';
      setUserName(name);
      setRegisteredEvents(data?.registeredEvents ?? []);
    });
  }, []);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => signOut(auth).then(() => router.replace('/')),
      },
    ]);
  };

  const handleChangePassword = () => {
    const email = auth.currentUser?.email;
    if (!email) return;
    sendPasswordResetEmail(auth, email)
      .then(() => Alert.alert('Email Sent', `A password reset link has been sent to ${email}.`))
      .catch((e: any) => Alert.alert('Error', e.message));
  };

  const displayedEvents = showAllEvents ? ALL_EVENTS : ALL_EVENTS.slice(0, POPULAR_COUNT);

  // ─── Events tab ────────────────────────────────────────────────────────────

  const renderEventsTab = () => (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.header, headerAnim]}>
        <Text style={styles.title}>Join Event</Text>
        <Text style={styles.subtitle}>Find your conference or meetup to start networking.</Text>
      </Animated.View>

      <Animated.View style={[styles.searchContainer, searchAnim]}>
        <Ionicons name="search-outline" size={18} color={COLORS.mediumGray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for an event..."
          placeholderTextColor={COLORS.mediumGray}
        />
      </Animated.View>

      <Animated.View style={qrAnim}>
        <TouchableOpacity activeOpacity={0.88} style={styles.qrCard} onPress={() => router.push('/qr-scanner')}>
          <View style={styles.qrIconWrapper}>
            <MaterialCommunityIcons name="qrcode-scan" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.qrTitle}>Scan Event QR Code</Text>
          <Text style={styles.qrSubtitle}>Check-in instantly at the venue</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.sectionRow, eventsLabelAnim]}>
        <Text style={styles.sectionLabel}>POPULAR EVENTS</Text>
        <TouchableOpacity onPress={() => setShowAllEvents((v) => !v)}>
          <Text style={styles.seeAllText}>{showAllEvents ? 'Show less' : 'See all'}</Text>
        </TouchableOpacity>
      </Animated.View>

      {displayedEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </ScrollView>
  );

  // ─── Registered tab ────────────────────────────────────────────────────────

  const renderRegisteredTab = () => (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.tabPageTitle}>Registered Events</Text>
      {registeredEvents.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={56} color={COLORS.lightGray} />
          <Text style={styles.emptyTitle}>No Registered Events</Text>
          <Text style={styles.emptySubtitle}>Events you join will appear here.</Text>
        </View>
      ) : (
        registeredEvents.map((event) => <EventCard key={event.id} event={event} />)
      )}
    </ScrollView>
  );

  // ─── Profile tab ───────────────────────────────────────────────────────────

  const initials = userName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const renderProfileTab = () => (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Avatar + name */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials || '?'}</Text>
        </View>
        <Text style={styles.profileName}>{userName || 'Your Name'}</Text>
        <Text style={styles.profileEmail}>{userEmail}</Text>
      </View>

      {/* Action items */}
      <View style={styles.menuCard}>
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.8}
          onPress={() => router.push('/personality-traits')}
        >
          <View style={styles.menuIconWrap}>
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.menuLabel}>Edit Onboarding Answers</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.mediumGray} />
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.8} onPress={handleChangePassword}>
          <View style={styles.menuIconWrap}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.menuLabel}>Change Password</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.mediumGray} />
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.8} onPress={handleSignOut}>
          <View style={[styles.menuIconWrap, { backgroundColor: '#FFF0F0' }]}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          </View>
          <Text style={[styles.menuLabel, { color: COLORS.error }]}>Sign Out</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.mediumGray} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        {activeTab === 'events' && renderEventsTab()}
        {activeTab === 'registered' && renderRegisteredTab()}
        {activeTab === 'profile' && renderProfileTab()}
      </View>

      <View style={styles.tabBar}>
        {([
          { key: 'events', label: 'Events', icon: 'home' },
          { key: 'registered', label: 'Registered', icon: 'calendar' },
          { key: 'profile', label: 'Profile', icon: 'person' },
        ] as { key: Tab; label: string; icon: string }[]).map(({ key, label, icon }) => {
          const active = activeTab === key;
          return (
            <TouchableOpacity key={key} style={styles.tabItem} onPress={() => setActiveTab(key)} activeOpacity={0.8}>
              <Ionicons
                name={(active ? icon : `${icon}-outline`) as any}
                size={24}
                color={active ? COLORS.primary : COLORS.mediumGray}
              />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  content: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 40 },

  // Events tab
  header: { marginBottom: 24, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.black, marginBottom: 6, letterSpacing: -0.5, textAlign: 'center' },
  subtitle: { fontSize: 15, color: COLORS.mediumGray, lineHeight: 22, textAlign: 'center' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.gray,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13,
    marginBottom: 16, borderWidth: 1, borderColor: COLORS.borderColor,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.black },
  qrCard: {
    backgroundColor: '#F5F0FF', borderRadius: 16, paddingVertical: 28,
    paddingHorizontal: 20, alignItems: 'center', marginBottom: 28,
    borderWidth: 1, borderColor: '#E0D0FF',
  },
  qrIconWrapper: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#EDE5FF',
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    borderWidth: 1, borderColor: '#D4BEFF',
  },
  qrTitle: { fontSize: 17, fontWeight: '700', color: COLORS.black, marginBottom: 4 },
  qrSubtitle: { fontSize: 13, color: COLORS.mediumGray },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: COLORS.mediumGray, letterSpacing: 1.2 },
  seeAllText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  eventCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderRadius: 14, paddingVertical: 16, paddingHorizontal: 16, marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.borderColor,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  eventInfo: { flex: 1 },
  eventName: { fontSize: 15, fontWeight: '700', color: COLORS.black, marginBottom: 5 },
  eventMeta: { flexDirection: 'row', alignItems: 'center' },
  eventMetaText: { fontSize: 12, color: COLORS.mediumGray, marginLeft: 3 },
  arrowButton: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginLeft: 12,
  },

  // Registered tab
  tabPageTitle: { fontSize: 26, fontWeight: '800', color: COLORS.black, marginBottom: 20, letterSpacing: -0.5, textAlign: 'center' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 80 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.black, textAlign: 'center' },
  emptySubtitle: { fontSize: 14, color: COLORS.mediumGray, textAlign: 'center', lineHeight: 20 },

  // Profile tab
  profileHeader: { alignItems: 'center', marginBottom: 32 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: COLORS.white },
  profileName: { fontSize: 20, fontWeight: '700', color: COLORS.black, marginBottom: 4 },
  profileEmail: { fontSize: 14, color: COLORS.mediumGray },
  menuCard: {
    borderWidth: 1, borderColor: COLORS.borderColor, borderRadius: 16,
    backgroundColor: COLORS.white, overflow: 'hidden',
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, gap: 12 },
  menuIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#E8F8F3', alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: COLORS.black },
  menuDivider: { height: 1, backgroundColor: COLORS.borderColor, marginLeft: 64 },

  // Bottom tab bar
  tabBar: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    borderTopWidth: 1, borderTopColor: COLORS.borderColor,
    paddingBottom: 8, paddingTop: 10,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  tabLabel: { fontSize: 11, fontWeight: '500', color: COLORS.mediumGray },
  tabLabelActive: { color: COLORS.primary, fontWeight: '700' },
});

export default JoinEventScreen;
