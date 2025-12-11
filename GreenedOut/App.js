import * as React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import LogGameScreen from './screens/LogGameScreen'; 
import LogInScreen from './screens/LogInScreen';
import CourseDetailScreen from './screens/CourseDetailScreen';
import JournalScreen from './screens/JournalScreen';
import LogRoundScreen from './screens/LogRoundScreen';
import RoundDetailScreen from './screens/RoundDetailScreen';
import { signOutFromGoogle } from './googleAuth';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = React.useState(null);
  const navigationRef = React.useRef(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleSignUpSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await signOutFromGoogle();
    } catch (error) {
    }
    
    setUser(null);
    
    if (navigationRef.current) {
      navigationRef.current.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          options={({ navigation }) => ({
            title: 'Greened Out',
            headerRight: user ? () => (
              <TouchableOpacity
                onPress={handleLogout}
                style={{ marginRight: 15 }}
              >
                <Text style={{ color: '#4CAF50', fontSize: 16 }}>Logout</Text>
              </TouchableOpacity>
            ) : null,
          })}
        >
          {props => <HomeScreen {...props} user={user} />}
        </Stack.Screen>

        <Stack.Screen
          name="Search"
          options={({ navigation }) => ({
            title: 'Search Courses',
            headerRight: user ? () => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Journal')}
                  style={{ marginRight: 15 }}
                >
                  <Text style={{ color: '#4CAF50', fontSize: 16 }}>Journal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleLogout}
                  style={{ marginRight: 15 }}
                >
                  <Text style={{ color: '#4CAF50', fontSize: 16 }}>Logout</Text>
                </TouchableOpacity>
              </View>
            ) : null,
          })}
        >
          {props => <SearchScreen {...props} user={user} />}
        </Stack.Screen>

        <Stack.Screen
          name="LogGame"
          component={LogGameScreen}
          options={{ title: 'Log a Round' }}
        />

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

        <Stack.Screen
          name="CourseDetail"
          options={{ title: 'Course Details' }}
        >
          {props => <CourseDetailScreen {...props} user={user} />}
        </Stack.Screen>

        <Stack.Screen
          name="Journal"
          options={{ title: 'My Golf Journal' }}
        >
          {props => <JournalScreen {...props} user={user} />}
        </Stack.Screen>

        <Stack.Screen
          name="LogRound"
          options={{ title: 'Log Round' }}
        >
          {props => <LogRoundScreen {...props} user={user} />}
        </Stack.Screen>

        <Stack.Screen
          name="RoundDetail"
          options={{ title: 'Round Details' }}
        >
          {props => <RoundDetailScreen {...props} user={user} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
