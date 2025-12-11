import {
  GoogleSignin,
} from "@react-native-google-signin/google-signin";
import Constants from 'expo-constants';

const GOOGLE_WEB_CLIENT_ID = '496859102995-evs7aubpnp7q62pqamrhoj02hk78g41o.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID = '496859102995-f8q2ofobhnkirp1lqbivebesa32f1s1b.apps.googleusercontent.com';

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
  offlineAccess: false,
});

export async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();

    if (!userInfo.data?.idToken) {
      throw new Error('No ID token present!');
    }

    return userInfo.data.idToken;
  } catch (error) {
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

export async function signOutFromGoogle() {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    throw error;
  }
}

export async function getCurrentGoogleUser() {
  try {
    const userInfo = await GoogleSignin.signInSilently();
    return userInfo;
  } catch (error) {
    return null;
  }
}
