import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { login, loginWithGoogle } from '../api';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '496859102995-gm3e5m5v7krh4vr7tie8dmvl0aoasmot.apps.googleusercontent.com';
  
  const [redirectUri, setRedirectUri] = React.useState('http://localhost:19006');

  useEffect(() => {
    const getRedirectUri = () => {
      if (typeof window !== 'undefined') {
        const currentUrl = window.location.origin;
        setRedirectUri(currentUrl);
      } else {
        const uri = 'http://localhost:19006';
        setRedirectUri(uri);
      }
    };
    
    getRedirectUri();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const response = await login({ email: email.trim().toLowerCase(), password });
      
      console.log('Login successful:', response);
      Alert.alert('Success', 'Logged in successfully!');
      
      if (onLoginSuccess) {
        onLoginSuccess(response);
      }
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert(
        'Login Failed',
        'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useCallback(async (idToken) => {
    try {
      setGoogleLoading(true);
      const response = await loginWithGoogle(idToken);
      
      if (!response) {
        Alert.alert('Error', 'No response from server. Please try again.');
        setGoogleLoading(false);
        return;
      }
      
      Alert.alert('Success', 'Logged in with Google successfully!');
      
      if (onLoginSuccess) {
        onLoginSuccess(response);
      }
    } catch (err) {
      console.error('Google login error:', err);
      console.error('Error details:', err.message, err.stack);
      Alert.alert(
        'Login Failed',
        `Google authentication failed: ${err.message || 'Please try again.'}`
      );
    } finally {
      setGoogleLoading(false);
    }
  }, [onLoginSuccess]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash && hash.includes('id_token=')) {
        const fragment = hash.substring(1);
        const params = new URLSearchParams(fragment);
        const idToken = params.get('id_token');
        
        if (idToken && !googleLoading) {
          window.history.replaceState(null, '', window.location.pathname);
          handleGoogleLogin(idToken);
        }
      }
    }
  }, [googleLoading, handleGoogleLogin]);

  const handleGoogleSignIn = async () => {
    try {
      if (!redirectUri) {
        Alert.alert('Error', 'Redirect URI not ready. Please wait a moment and try again.');
        return;
      }
      
      setGoogleLoading(true);
      
      const scopes = encodeURIComponent('openid profile email');
      const nonce = Math.random().toString(36).substring(2, 15);
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=id_token` +
        `&scope=${scopes}` +
        `&nonce=${nonce}`;
      
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      
      if (result.type === 'success' && result.url) {
        const fragment = result.url.split('#')[1];
        if (fragment) {
          const params = new URLSearchParams(fragment);
          const idToken = params.get('id_token');
          
          if (idToken) {
            await handleGoogleLogin(idToken);
          } else {
            setGoogleLoading(false);
            Alert.alert('Error', 'No ID token received from Google');
          }
        } else {
          setGoogleLoading(false);
          Alert.alert('Error', 'Invalid response from Google');
        }
      } else if (result.type === 'cancel') {
        setGoogleLoading(false);
      } else {
        setGoogleLoading(false);
        Alert.alert('Error', 'Google sign-in was cancelled or failed');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setGoogleLoading(false);
      Alert.alert('Error', 'Failed to initiate Google sign-in: ' + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Log in to your Greened Out account</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[styles.googleButton, (googleLoading || loading) && styles.buttonDisabled]}
              onPress={handleGoogleSignIn}
              disabled={googleLoading || loading}
            >
              {googleLoading ? (
                <ActivityIndicator color="#666" />
              ) : (
                <>
                  <Text style={styles.googleButtonText}></Text>
                  <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp')}
              disabled={loading}
            >
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 15,
    color: '#666',
  },
  linkText: {
    fontSize: 15,
    color: '#4CAF50',
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 14,
    color: '#999',
  },
  googleButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});