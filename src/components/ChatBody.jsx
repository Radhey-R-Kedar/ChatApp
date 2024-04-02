import {FlatList, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../theams/Colors';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {getDeviceId} from '../utils/Functions';

const MyMessageView = ({message, time}) => {
  return (
    <View className="flex flex-row justify-end max-w-[100%] mb-2">
      <View className="max-w-[80%]">
        <LinearGradient
          colors={['#fe6255', '#f33676']}
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
        <View className="p-2 rounded-t-2xl rounded-r-2xl bg-LightPink">
          <Text style={{color: Colors.black}}>{message}</Text>
        </View>
        <Text className="text-mediumGray text-xs">{time}</Text>
      </View>
    </View>
  );
};
const ChatBody = props => {
  const chatdata = useSelector(state => state.chatdata);
  const dispatch = useDispatch();
  const scrollViewRef = useRef();
  const userId = getDeviceId();
  const chatRoomId = props.roomId;

  let newChatMessages =
    chatdata && chatdata[`newMsgArr_${chatRoomId}`]
      ? [...chatdata[`newMsgArr_${chatRoomId}`]]
      : [];

  let oldChatDataList =
    chatdata && chatdata[chatRoomId] ? [...chatdata[chatRoomId]] : [];


  const lastMessageIdFormOldChatDataList =
    oldChatDataList.length > 0
      ? oldChatDataList[oldChatDataList.length - 1].msgId
      : null;

  let index = -1;
  if (lastMessageIdFormOldChatDataList != null) {
    index = newChatMessages.findIndex(
      x => x.msgId === lastMessageIdFormOldChatDataList,
    );
  }

  let finalMessageList = [];

  if (index != -1) {
    finalMessageList = [
      ...oldChatDataList,
      ...newChatMessages.slice(index + 1),
    ];
  } else {
    finalMessageList = [...oldChatDataList, ...newChatMessages];
  }

  console.log("Chat Body reloaded----------------------------");
  useEffect(() => {
    const unsubscribe = firestore()
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
      });
  
    return () => {
      // Unsubscribe from the Firestore listener when the component unmounts
      unsubscribe();
    };
  }, [props.roomId]); // Include props.roomId in the dependency array
  

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
      return <MyMessageView message={item.body} time={timeString} />;
    } else {
      return <AnotherPersonMessage message={item.body} time={timeString} />;
    }
  };

  return (
    <FlatList
      data={finalMessageList}
      renderItem={({item, index}) => renderItem({item, index})}
      keyExtractor={item => item.msgId}
      ref={scrollViewRef}
      onContentSizeChange={scrollToEnd}
      showsVerticalScrollIndicator={false}
      className="pl-4 pr-4" 
    />
  );
};

export default ChatBody;
