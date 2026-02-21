import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedOption from '../components/AnimatedOption';
import { auth, db } from '../config/firebase';
import { LINKEDIN_CONFIG } from '../config/linkedin';
import { COLORS } from '../constants/colors';

// Required by expo-web-browser to complete the auth session when the app is reopened via deep link
WebBrowser.maybeCompleteAuthSession();

const ProfessionalIdentity = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      // Build the LinkedIn authorization URL
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: LINKEDIN_CONFIG.clientId,
        redirect_uri: LINKEDIN_CONFIG.redirectUri,
        scope: LINKEDIN_CONFIG.scopes.join(' '),
        state: Math.random().toString(36).slice(2), // CSRF protection
        prompt: 'login', // Force LinkedIn to always show the login page
      });

      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params}`;

      // Open LinkedIn login in browser. iOS ASWebAuthenticationSession intercepts
      // the networkingapp:// redirect from the Firebase page automatically.
      // preferEphemeralSession: true opens a private browser with no shared Safari cookies,
      // forcing LinkedIn to always show the username/password screen.
      const result = await WebBrowser.openAuthSessionAsync(authUrl, 'networkingapp://oauth', {
        preferEphemeralSession: true,
      });

      if (result.type !== 'success') {
        // User cancelled or dismissed
        setLoading(false);
        return;
      }

      // Extract the auth code using regex — new URL() is unreliable with custom schemes in React Native
      const codeMatch = result.url.match(/[?&]code=([^&]+)/);
      const code = codeMatch ? decodeURIComponent(codeMatch[1]) : null;

      if (!code) {
        throw new Error('No authorization code received from LinkedIn.');
      }

      await exchangeCodeForToken(code);
    } catch (error: any) {
      setLoading(false);
      Alert.alert('LinkedIn Error', error.message ?? 'Something went wrong. Please try again.');
    }
  };

  const exchangeCodeForToken = async (code: string) => {
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: [
        'grant_type=authorization_code',
        `code=${encodeURIComponent(code)}`,
        `redirect_uri=${encodeURIComponent(LINKEDIN_CONFIG.redirectUri)}`,
        `client_id=${encodeURIComponent(LINKEDIN_CONFIG.clientId)}`,
        `client_secret=${encodeURIComponent(LINKEDIN_CONFIG.clientSecret)}`,
      ].join('&'),
    });

    const tokenData = await tokenResponse.json();
    console.log('[LinkedIn] Token response:', JSON.stringify(tokenData, null, 2));

    if (!tokenData.access_token) {
      throw new Error(tokenData.error_description ?? 'Failed to get access token from LinkedIn.');
    }

    await fetchAndSaveProfile(tokenData.access_token);
  };

  const fetchAndSaveProfile = async (accessToken: string) => {
    const headers = { Authorization: `Bearer ${accessToken}` };

    // OIDC identity fields (name, email, picture, sub)
    const userinfoRes = await fetch('https://api.linkedin.com/v2/userinfo', { headers });
    const profile = await userinfoRes.json();
    console.log('[LinkedIn] /v2/userinfo response:', JSON.stringify(profile, null, 2));

    // Professional background — requires r_liteprofile; may return 403 on standard apps
    let me: Record<string, any> = {};
    try {
      const meRes = await fetch(
        'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,headline,summary,profilePicture(displayImage~:playableStreams),positions,educations)',
        { headers }
      );
      me = await meRes.json();
      console.log('[LinkedIn] /v2/me response:', JSON.stringify(me, null, 2));
    } catch (e) {
      console.log('[LinkedIn] /v2/me not available for this app:', e);
    }

    const user = auth.currentUser;
    if (!user) {
      throw new Error('Session expired. Please sign in again.');
    }

    // Save LinkedIn profile data into Firebase Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      linkedin: {
        name: profile.name ?? '',
        email: profile.email ?? '',
        picture: profile.picture ?? '',
        sub: profile.sub ?? '',
        headline: me.headline ?? '',
        summary: me.summary ?? '',
        firstName: me.firstName?.localized ?? {},
        lastName: me.lastName?.localized ?? {},
        positions: me.positions?.elements ?? [],
        educations: me.educations?.elements ?? [],
        rawMe: me,
      },
      linkedinConnected: true,
    });

    setLoading(false);
    router.push('/personality-traits');
  };

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

        <TouchableOpacity
          style={[styles.connectButton, loading && styles.buttonDisabled]}
          onPress={handleConnect}
          disabled={loading}
        >
          <View style={styles.connectInner}>
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Ionicons name="logo-linkedin" size={20} color={COLORS.white} />
            )}
            <Text style={styles.connectText}>
              {loading ? '  Connecting...' : '  Connect LinkedIn'}
            </Text>
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
  buttonDisabled: {
    opacity: 0.6,
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
