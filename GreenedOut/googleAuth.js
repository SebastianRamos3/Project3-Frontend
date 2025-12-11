import {
  GoogleSignin,
} from "@react-native-google-signin/google-signin";
import Constants from 'expo-constants';

// Configure Google Sign-In
// IMPORTANT: 
// - webClientId: Use the Web Client ID from Google Cloud Console (NOT Android Client ID)
// - iosClientId: Use the iOS Client ID from Google Cloud Console
// 
// Get these from: Google Cloud Console > APIs & Services > Credentials
// 
// For development, you can use environment variables:
// const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
// const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

// Replace these with your actual Client IDs from Google Cloud Console
const GOOGLE_WEB_CLIENT_ID = '496859102995-evs7aubpnp7q62pqamrhoj02hk78g41o.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID = '496859102995-f8q2ofobhnkirp1lqbivebesa32f1s1b.apps.googleusercontent.com';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID, // Web Client ID (required for Android)
  iosClientId: GOOGLE_IOS_CLIENT_ID, // iOS Client ID (required for iOS)
  offlineAccess: false, // We only need the ID token, not offline access
});

/**
 * Sign in with Google OAuth
 * @returns {Promise<string>} The Google ID token
 */
export async function signInWithGoogle() {
  try {
    // Check if Google Play Services are available (Android only)
    await GoogleSignin.hasPlayServices();

    // Sign in and get user info
    const userInfo = await GoogleSignin.signIn();

    if (!userInfo.data?.idToken) {
      throw new Error('No ID token present!');
    }

    // Return the ID token to be sent to the backend
    return userInfo.data.idToken;
  } catch (error) {
    console.error('Google sign-in error:', error);
    
    // Handle specific error cases
    if (error.code === 'SIGN_IN_CANCELLED') {
      throw new Error('Google sign-in was cancelled');
    } else if (error.code === 'DEVELOPER_ERROR') {
      throw new Error('DEVELOPER_ERROR: Check your OAuth client configuration and SHA-1 certificate fingerprint');
    } else if (error.code === 'SIGN_IN_REQUIRED') {
      throw new Error('Sign in required');
    } else if (error.message) {
      throw error;
    } else {
      throw new Error('Google sign-in failed. Please try again.');
    }
  }
}

/**
 * Sign out from Google
 */
export async function signOutFromGoogle() {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.error('Google sign-out error:', error);
    throw error;
  }
}

/**
 * Get current user info (if signed in)
 */
export async function getCurrentGoogleUser() {
  try {
    const userInfo = await GoogleSignin.signInSilently();
    return userInfo;
  } catch (error) {
    console.error('Get current Google user error:', error);
    return null;
  }
}
