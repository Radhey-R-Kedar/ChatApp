import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import ChatListScreen from '../screens/ChatListScreen';

const Stack = createStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='ChatListScreen'>
         <Stack.Screen
          name="ChatListScreen"
          component={ChatListScreen}
          options={{headerShown:false}}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{headerShown:false}}
        />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
