import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ImageBackground,
  BackHandler,
  LogBox,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../theams/Colors';
import ChatHeader from '../components/ChatHeader';
import ChatBody from '../components/ChatBody';
import ChatFooter from '../components/ChatFooter';
import {getDeviceId} from '../utils/Functions';
import firestore from '@react-native-firebase/firestore';
import {updateAsyncStorageWithChatDataInChatRoom} from '../utils/AsyncStorageFunctions';
import {useSelector} from 'react-redux';

const ChatScreen = props => {
  let roomId = props.route.params.roomId;
  let name = props.route.params.name;
  let profile = props.route.params.profile;
  let userId = getDeviceId();

  const chatRef = firestore().collection('chatrooms').doc(roomId);

  useEffect(() => {
    const onBackPress = () => {
      updateAsyncStorageWithChatDataInChatRoom(roomId);
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [roomId]);

  console.log('ChatScreen reloaded============================');
  

  return (
    <>
      <StatusBar backgroundColor={Colors.statusBar} />
      <ChatHeader name={name} profile={profile} roomId={roomId} />
      <View className="flex-1">
        <ChatBody roomId={roomId} />
      </View>
      <ChatFooter chatRef={chatRef} userId={userId} />
    </>
  );
};

export default ChatScreen;
