import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Welcome to Greened Out!</Text>
      <Button
      title="Log In"
      onPress={() => navigation.navigate('LogIn')}
      />
      <Button
      title="Sign Up"
      onPress={() => navigation.navigate('SignUp')}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});