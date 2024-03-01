import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import ChatListHeader from '../components/chatListHeader';
import ChatListBody from '../components/ChatListBody';
import {Colors} from '../theams/Colors';
import MyModal from '../components/MyModal';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {getDeviceId, getImage} from '../utils/Functions';
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import VectorIcon from '../utils/VectorIcon';
import SettingModal from '../components/SettingModal';

const Tab = createMaterialTopTabNavigator();

const ChatListScreen = () => {
  
  const [showModal, setShowModal] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);

  const onAddUser = () => {
    setShowModal(true);
  };
  const onThreeDotPress = () => {
    setShowSettingModal(true);
  };

  const [constainData, setContainsData] = useState(false);
  const [chatRoomList, setChatRoomList] = useState([]);

  useEffect(() => {
    const userId = getDeviceId();
    fetchChatListData(userId)
      .then(data => {
        setChatRoomList(data);
      })
      .catch(err => console.log('Useeffect ' + err));
  }, [constainData]);

  const fetchChatListData = async userId => {
    const AllChatRoomData = await firestore()
      .collection('users')
      .doc(userId)
      .get()
      .then(async chatRef => {
        const userData = chatRef?.data();
        if (userData == undefined && !constainData) {
          setContainsData(!constainData);
        }

        const allChatRooms = userData?.chatrooms;
        const myChatRooms = userData?.mychatrooms;

        const chatRoomData = await Promise.all(
          allChatRooms.map(async room => {
            const roomRef = await firestore()
              .collection('chats')
              .doc(room)
              .get();
            const data = roomRef.data();
            const id = roomRef.id;
            const name = data.name;
            const profile = await getImage(data.profile);
            const ismychatroom = myChatRooms?.includes(room) ? true : false;
            return {id, name, profile, ismychatroom};
          }),
        );
        return chatRoomData;
      })
      .catch(err => {
        console.log('New Error', err);
      });
    return AllChatRoomData;
  };

  return (
    <View className="flex-1">
      <StatusBar backgroundColor={Colors.statusBar} />
      <ChatListHeader onAddUser={onAddUser} onThreeDotPress={onThreeDotPress}/>
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
              onAddUser={onAddUser}
              chatRoomList={chatRoomList}
              fetchChatListData={fetchChatListData}
              setChatRoomList={setChatRoomList}
              isMyChats = {false}
            />
          )}
        />
        <Tab.Screen
          name="My Chats"
          children={props => (
            <ChatListBody
              {...props}
              chatRoomList={chatRoomList}
              fetchChatListData={fetchChatListData}
              setChatRoomList={setChatRoomList}
              isMyChats = {true}
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
      <SettingModal showSettingModal={showSettingModal} setShowSettingModal={setShowSettingModal}/>
      <MyModal showModal={showModal} setShowModal={setShowModal} />
    </View>
  );
};

export default ChatListScreen;
