import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import LogGameScreen from './screens/LogGameScreen'; 
import LogInScreen from './screens/LogInScreen';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = React.useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleSignUpSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Greened Out' }} 
        />
        <Stack.Screen 
          name="Search" 
          component={SearchScreen} 
          options={{ title: 'Search Courses' }}
        />
        <Stack.Screen
          name="LogGame"
          component={LogGameScreen}
          options={{ title: 'Log a Round' }}
        />
      <Stack.Navigator>
        {user == null ? (
          // Auth Stack - User is NOT signed in
          <>
            <Stack.Screen
              name="LogIn"
              options={{ title: 'Log In' }}
            >
              {props => <LogInScreen {...props} onLoginSuccess={handleLoginSuccess} />}
            </Stack.Screen>
            <Stack.Screen
              name="SignUp"
              options={{ title: 'Sign Up' }}
            >
              {props => <SignUpScreen {...props} onSignUpSuccess={handleSignUpSuccess} />}
            </Stack.Screen>
          </>
        ) : (
          // App Stack - User IS signed in (goes to Search after login)
          <>
            <Stack.Screen
              name="Search"
              options={{
                title: 'Search Courses',
                headerRight: () => (
                  <TouchableOpacity
                    onPress={handleLogout}
                    style={{ marginRight: 15 }}
                  >
                    <Text style={{ color: '#4CAF50', fontSize: 16 }}>Logout</Text>
                  </TouchableOpacity>
                ),
              }}
            >
              {props => <SearchScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen
              name="Home"
              options={{
                title: 'Greened Out',
                headerRight: () => (
                  <TouchableOpacity
                    onPress={handleLogout}
                    style={{ marginRight: 15 }}
                  >
                    <Text style={{ color: '#4CAF50', fontSize: 16 }}>Logout</Text>
                  </TouchableOpacity>
                ),
              }}
            >
              {props => <HomeScreen {...props} user={user} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
