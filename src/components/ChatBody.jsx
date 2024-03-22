import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../theams/Colors';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDeviceId} from '../utils/Functions';

const MyMessageView = ({message, time}) => {
  return (
    <View className="flex flex-row justify-end max-w-[100%] mb-2">
      <View className="max-w-[80%]">
        <LinearGradient
          colors={['#fe6255', '#f33676']}
          style={styles.linearGradient}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}
          className="p-2 rounded-t-2xl rounded-l-2xl">
          <Text>{message}</Text>
        </LinearGradient>
        <Text className="text-mediumGray text-right text-[11px]">{time}</Text>
      </View>
    </View>
  );
};

const AnotherPersonMessage = ({message, time}) => {
  return (
    <View className="flex flex-row justify-start max-w-[100%] mb-2">
      <View className="max-w-[80%]">
        <View className="p-2 rounded-t-2xl rounded-r-2xl bg-lightPink">
          <Text style={{color: Colors.black}}>{message}</Text>
        </View>
        <Text className="text-mediumGray text-xs">{time}</Text>
      </View>
    </View>
  );
};
const ChatBody = props => {
  const chatdata = useSelector(state => state.chatdata);
  const userinfo = useSelector(state => state.userinfo);
  const dispatch = useDispatch();
  const scrollViewRef = useRef();
  const userId = getDeviceId();
  const chatRoomId = props.roomId;
  console.log("Log ChatDat", chatdata[`newMsgArr_${chatRoomId}`]);

  let lastMsgId =  chatdata && chatdata[chatRoomId][0]!= undefined ? chatdata[chatRoomId][chatdata[chatRoomId].length-1].msgId :null 

  let chatDataList = chatdata && chatdata[`newMsgArr_${chatRoomId}`] ? [...chatdata[`newMsgArr_${chatRoomId}`]] : [];

const index = chatDataList.findIndex(item => item.msgId === lastMsgId);

let uniqueMessageList=[];
if (index !== -1) {
   uniqueMessageList = chatDataList.slice(index + 1);
} else {
  uniqueMessageList=[]
}

  let finalMessageList = [...chatdata[chatRoomId], ...uniqueMessageList]

 

  useEffect(() => {
    const fetchData = async () => {
      firestore()
        .collection('chatrooms')
        .doc(props.roomId)
        .collection('messages')
        .orderBy('timestamp')
        .onSnapshot(async snapShot => {
          const allMessages = snapShot.docs.map(snap => {
            return {msgId: snap.id, ...snap.data()};
          });
          dispatch({
            type: 'setNewMessages',
            payload: {roomId: chatRoomId, messages: allMessages},
          });

          if (chatdata[chatRoomId].length == 0) {
            dispatch({
              type: 'addMessage',
              payload: {roomId: chatRoomId, messages: allMessages},
            });
            await AsyncStorage.setItem(chatRoomId, JSON.stringify(allMessages));
          }          
        });
    };

    fetchData();
  }, [userinfo.isOnline]);

  const scrollToEnd = () => {
    scrollViewRef.current.scrollToEnd({animated: true});
  };

  const renderItem = ({item}) => {
    const timestamp = item.timestamp;
    let timeString = '';
    if (timestamp && timestamp.seconds && timestamp.nanoseconds) {
      const milliseconds =
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
      const date = new Date(milliseconds);
      timeString = date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
    }

    if (item.sender == userId) {
      return (
        <MyMessageView key={item.msgId} message={item.body} time={timeString} />
      );
    } else {
      return (
        <AnotherPersonMessage
          key={item.msgId}
          message={item.body}
          time={timeString}
        />
      );
    }
  };

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={scrollToEnd}
        showsVerticalScrollIndicator={false}
        className="flex-1 p-3">
        {finalMessageList.map((item, index) => renderItem({item, index}))}
      </ScrollView>
      <View></View>
    </>
  );
};

export default ChatBody;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3,
  },
});
