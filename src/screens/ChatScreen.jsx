import {View, Text, StatusBar, StyleSheet, ImageBackground} from 'react-native';
import React, { useEffect, useState } from 'react';
import {Colors} from '../theams/Colors';
import ChatHeader from '../components/ChatHeader';
import ChatBody from '../components/ChatBody';
import ChatFooter from '../components/ChatFooter';
import { getDeviceId } from '../utils/Functions';
import firestore from '@react-native-firebase/firestore';


const ChatScreen = props => {
  let roomId = props.route.params.roomId;
  let name = props.route.params.name;
  let profile = props.route.params.profile;
  let userId = getDeviceId();

  const chatRef = firestore().collection('chatrooms').doc(roomId);


  return (
    <>
      <StatusBar backgroundColor={Colors.statusBar} />
      <ChatHeader name={name} profile={profile}/>
      <View className="flex-1">
        <ChatBody roomId={roomId}/>
      </View>
      <ChatFooter chatRef={chatRef} userId={userId}/>
    </>
  );
};

export default ChatScreen;
