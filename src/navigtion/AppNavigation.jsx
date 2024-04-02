import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ChatScreen from '../screens/ChatScreen';
import ChatListScreen from '../screens/ChatListScreen';
import {useDispatch, useSelector} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { updateAsyncStorageWithChatData } from '../utils/AsyncStorageFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileScreen from '../screens/ProfileScreen';
const Stack = createStackNavigator();

const AppNavigation = () => {
  const dispatch = useDispatch();
  const chatlist = useSelector(state=>state.chatlist);
  const userinfo = useSelector(state=>state.userinfo);


  const checkUserOnlineStatus = () => {
    NetInfo.addEventListener(state => {
      if(state.isConnected){
        dispatch({type:'setOnlineStatus', payload: true})
      }else{
        dispatch({type:'setOnlineStatus', payload: false})
      }
    });
  };

  const updateReducerListsWithChatData =(chatRoomList)=>{
     if(chatRoomList.length != 0){
        chatRoomList.forEach(async chatRoom => {
          const storedData = await AsyncStorage.getItem(chatRoom.id);
          const asyncStorageData = storedData!=null ? JSON.parse(storedData) : [];
          dispatch({
            type: 'setMessages',
            payload: { roomId: chatRoom.id, messages: asyncStorageData },
          });
        });
     }
  }

  useEffect(() => {
    checkUserOnlineStatus();
  }, []);

  useEffect(() => {
    updateReducerListsWithChatData(chatlist.chatRoomList);
  }, [userinfo.isOnline]);

console.log("navigation called");

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ChatListScreen">
        <Stack.Screen
          name="ChatListScreen"
          component={ChatListScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
