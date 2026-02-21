// LinkedIn OAuth Configuration
// The redirect URL is a Firebase Hosting page that bounces back into the app.
// In your LinkedIn app → Auth tab → Authorized redirect URLs, add:
//   https://um-hackathon-networking.web.app/auth/linkedin

export const LINKEDIN_CONFIG = {
  clientId: '862zfym9lidnov',
  clientSecret: process.env.EXPO_PUBLIC_LINKEDIN_CLIENT_SECRET ?? '',
  // Firebase Hosting redirect URL (LinkedIn accepts this because it's HTTPS)
  redirectUri: 'https://um-hackathon-networking.web.app/auth/linkedin',
  scopes: ['openid', 'profile', 'email'],
};
