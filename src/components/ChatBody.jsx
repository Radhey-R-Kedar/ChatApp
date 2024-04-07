import { Text, View, ScrollView } from 'react-native';
import React, { useEffect, useRef } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../theams/Colors';
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { getDeviceId } from '../utils/Functions';

const MyMessageView = ({ message, time }) => {
  return (
    <View className="flex flex-row justify-end max-w-[100%] mb-2">
      <View className="max-w-[80%]">
        <LinearGradient
          colors={['#fe6255', '#f33676']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="p-2 rounded-t-2xl rounded-l-2xl">
          <Text>{message}</Text>
        </LinearGradient>
        <Text className="text-mediumGray text-right text-[11px]">{time}</Text>
      </View>
    </View>
  );
};

const AnotherPersonMessage = ({ message, time }) => {
  return (
    <View className="flex flex-row justify-start max-w-[100%] mb-2">
      <View className="max-w-[80%]">
        <View className="p-2 rounded-t-2xl rounded-r-2xl bg-LightPink">
          <Text style={{ color: Colors.black }}>{message}</Text>
        </View>
        <Text className="text-mediumGray text-xs">{time}</Text>
      </View>
    </View>
  );
};

const ChatBody = (props) => {
  const chatdata = useSelector((state) => state.chatdata);
  const dispatch = useDispatch();
  const scrollViewRef = useRef();
  const userId = getDeviceId();
  const chatRoomId = props.roomId;

  console.log(chatdata.lastMessageTimestamps[`timestamp_${chatRoomId}`]);


  let newChatMessages =
    chatdata && chatdata[`newMsgArr_${chatRoomId}`]
      ? [...chatdata[`newMsgArr_${chatRoomId}`]]
      : [];

  console.log(newChatMessages);

  let oldChatDataList =
    chatdata && chatdata[chatRoomId] ? [...chatdata[chatRoomId]] : [];

  let finalMessageList = [];

    finalMessageList = [...oldChatDataList, ...newChatMessages];
  

  console.log('Chat Body reloaded----------------------------');
  useEffect(() => {
    const lastTimestamp = chatdata.lastMessageTimestamps[`timestamp_${chatRoomId}`];
    let query = firestore()
      .collection('chatrooms')
      .doc(props.roomId)
      .collection('messages')
      .orderBy('timestamp');
  
    if (lastTimestamp) {
      const milliseconds = lastTimestamp.seconds * 1000 + lastTimestamp.nanoseconds / 1000000;
      const lastMessageDate = new Date(milliseconds);
      query = query.startAfter(lastMessageDate);
    }
  
    const unsubscribe = query.onSnapshot(async (snapShot) => {
      const allMessages = snapShot.docs.map((snap) => {
        return { msgId: snap.id, ...snap.data() };
      });
      dispatch({
        type: 'setNewMessages',
        payload: { roomId: chatRoomId, messages: allMessages },
      });
    });
  
    return () => {
      // Unsubscribe from the Firestore listener when the component unmounts
      unsubscribe();
    };
  }, [props.roomId, chatdata.lastMessageTimestamps[`timestamp_${chatRoomId}`]]); // Include props.roomId in the dependency array

  const scrollToEnd = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  const renderMessages = () => {
    return finalMessageList.map((item, index) => {
      const timestamp = item.timestamp;
      let timeString = '';
      if (timestamp && timestamp.seconds && timestamp.nanoseconds) {
        const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
        const date = new Date(milliseconds);
        timeString = date.toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });
      }

      if (item.sender == userId) {
        return <MyMessageView key={index} message={item.body} time={timeString} />;
      } else {
        return <AnotherPersonMessage key={index} message={item.body} time={timeString} />;
      }
    });
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      onContentSizeChange={scrollToEnd}
      showsVerticalScrollIndicator={false}
      className="pl-4 pr-4">
      {renderMessages()}
    </ScrollView>
  );
};

export default ChatBody;
