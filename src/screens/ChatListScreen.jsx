import {StatusBar, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import ChatListHeader from '../components/ChatListHeader';
import ChatListBody from '../components/ChatListBody';
import {Colors} from '../theams/Colors';
import MyModal from '../Modals/MyModal';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {TouchableOpacity} from 'react-native-gesture-handler';
import VectorIcon from '../utils/VectorIcon';
import SettingModal from '../Modals/SettingModal';
import {useDispatch, useSelector} from 'react-redux';
import {fetchChatListData} from '../utils/FireBaseFunctions';
import {
  getChatListDataFromStorage,
  updateAsyncStorageWithChatData,
  updateAsyncStorageWithChatListData,
} from '../utils/AsyncStorageFunctions';
import OptionsHeader from '../components/OptionsHeader';
import QRCodeModal from '../Modals/QRCodeModal';

const Tab = createMaterialTopTabNavigator();

const ChatListScreen = () => {
  console.log('ChatListScreen reloaded');
  const dispatch = useDispatch();

  const userinfo = useSelector(state => state.userinfo);
  const chatlist = useSelector(state => state.chatlist);

  const onAddUser = () => {
    dispatch({type: 'toggleAddUserModal'});
  };
  const onThreeDotPress = () => {
    dispatch({type: 'toggleOptionsModal'});
  };

  const fetchChatListAndUpdateStorageData = async (retryCount = 0) => {
    if (userinfo.isOnline) {
      try {
        const chatRoomList = await fetchChatListData();
        if (chatRoomList.status === 'no data' && retryCount < 2) {
          await fetchChatListAndUpdateStorageData(retryCount + 1);
        } else if (chatRoomList.status === 'success') {
          await updateAsyncStorageWithChatListData(chatRoomList.data);
          onRefresh2();
        }
      } catch (error) {
        console.error('An error occurred while fetching chat rooms:', error);
      }
    }
  };

  const fetchChatListFromStorageAndUpdateChatRoomList = () => {
    getChatListDataFromStorage().then(chatRoomList => {
      dispatch({
        type: 'fetchChatListSuccess',
        payload: chatRoomList,
      });
    });
  };

  const onRefresh2 = React.useCallback(() => {
    dispatch({type: 'toggleRefreshing'});
    setTimeout(() => {
      fetchChatListFromStorageAndUpdateChatRoomList();
      dispatch({type: 'toggleRefreshing'});
    }, 1000);
  }, []);

  const onAddUserRefresh = () => {
    dispatch({type: 'toggleRefreshing'});
    setTimeout(() => {
      fetchChatListAndUpdateStorageData();
      dispatch({type: 'toggleRefreshing'});
      setTimeout(() => {
        onRefresh();
      }, 1000);
    }, 1000);
  };

  const onRefresh = React.useCallback(() => {
    dispatch({type: 'toggleRefreshing'});
    setTimeout(() => {
      fetchChatListAndUpdateStorageData();

      setTimeout(() => {
        fetchChatListFromStorageAndUpdateChatRoomList();
      }, 1000);

      dispatch({type: 'toggleRefreshing'});
    }, 1000);
  }, []);

  useEffect(() => {
    updateAsyncStorageWithChatData();
    fetchChatListFromStorageAndUpdateChatRoomList();
  }, []);

  useEffect(() => {
    fetchChatListAndUpdateStorageData();
  }, [userinfo.isOnline]);

  return (
    <View className="flex-1">
      <StatusBar backgroundColor={Colors.statusBar} />
      {chatlist.isChatRoomSelected ? (
        <OptionsHeader onRefresh={onRefresh} onThreeDotPress={onThreeDotPress} />
      ) : (
        <ChatListHeader
          onThreeDotPress={onThreeDotPress}
        />
      )}
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
            <ChatListBody {...props} onRefresh={onRefresh} isMyChats={false} />
          )}
        />
        <Tab.Screen
          name="My Chats"
          children={props => (
            <ChatListBody {...props} onRefresh={onRefresh} isMyChats={true} />
          )}
        />
      </Tab.Navigator>
      {!chatlist.isChatRoomSelected && (
        <TouchableOpacity className="border-2 border-orange bg-HeaderColor h-16 w-16 rounded-full items-center justify-center absolute right-5 bottom-5">
          <VectorIcon
            type="Octicons"
            name="person-add"
            size={25}
            color={Colors.black}
            onPress={() => onAddUser()}
          />
        </TouchableOpacity>
      )}
      <SettingModal onAddUser={onAddUser} />
      <MyModal onRefresh={onAddUserRefresh} />
      <QRCodeModal onRefresh={onRefresh} />
    </View>
  );
};

export default ChatListScreen;
