import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import LogGameScreen from './screens/LogGameScreen'; // ⬅️ NEW

const Stack = createStackNavigator();

export default function App() {
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
