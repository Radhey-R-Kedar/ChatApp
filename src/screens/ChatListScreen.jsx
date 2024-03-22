import {StatusBar, View} from 'react-native';
import React, {useEffect} from 'react';
import ChatListHeader from '../components/chatListHeader';
import ChatListBody from '../components/ChatListBody';
import {Colors} from '../theams/Colors';
import MyModal from '../components/MyModal';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {TouchableOpacity} from 'react-native-gesture-handler';
import VectorIcon from '../utils/VectorIcon';
import SettingModal from '../components/SettingModal';
import {useDispatch} from 'react-redux';
import {fetchChatListData} from '../utils/FireBaseFunctions';

const Tab = createMaterialTopTabNavigator();

const ChatListScreen = () => {
  const dispatch = useDispatch();
  const onAddUser = () => {
    dispatch({type: 'toggleAddUserModal'});
  };
  const onThreeDotPress = () => {
    dispatch({type: 'toggleOptionsModal'});
  };

  const fetchChatListAndUpdateState = async dispatch => {
    try {
      const chatRoomList = await fetchChatListData();
      dispatch({type: 'fetchChatListSuccess', payload: chatRoomList});
    } catch (error) {
      console.error('Failed to fetch chat list:', error);
    }
  };

  useEffect(() => {
    fetchChatListAndUpdateState(dispatch);
  }, [dispatch]);


  return (
    <View className="flex-1">
      <StatusBar backgroundColor={Colors.statusBar} />
      <ChatListHeader onAddUser={onAddUser} onThreeDotPress={onThreeDotPress} />
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {fontSize: 15},
          tabBarItemStyle: {justifyContent: 'center', alignItems: 'center'},
          tabBarStyle: {
            backgroundColor: Colors.headerColor,
            height: 40,
            justifyContent: 'center',
          },
        }}>
        <Tab.Screen
          name="All"
          children={props => (
            <ChatListBody
              {...props}
              fetchChatListAndUpdateState={fetchChatListAndUpdateState}
              isMyChats={false}
            />
          )}
        />
        <Tab.Screen
          name="My Chats"
          children={props => (
            <ChatListBody
              {...props}
              fetchChatListAndUpdateState={fetchChatListAndUpdateState}
              isMyChats={true}
            />
          )}
        />
      </Tab.Navigator>
      <TouchableOpacity className="border-2 border-orange bg-headerColor h-16 w-16 rounded-full items-center justify-center absolute right-5 bottom-5">
        <VectorIcon
          type="Octicons"
          name="person-add"
          size={25}
          color={Colors.black}
          onPress={() => onAddUser()}
        />
      </TouchableOpacity>
      <SettingModal />
      <MyModal />
    </View>
  );
};

export default ChatListScreen;
