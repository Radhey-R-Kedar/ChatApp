import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../theams/Colors';
import firestore from '@react-native-firebase/firestore';

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
  const scrollViewRef = useRef();
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    firestore()
      .collection('chats')
      .doc(props.roomId)
      .collection('messages')
      .orderBy('timestamp')
      .onSnapshot(snapShot => {
        const allMessages = snapShot.docs.map(snap => {
          return {msgId: snap.id, ...snap.data()};
        });
        setMessages(allMessages);
      });
  }, []);

  const scrollToEnd = () => {
    scrollViewRef.current.scrollToEnd({animated: true});
  };

  const renderItem = ({item}) => {
    if (item.sender === props.userId) {
       return (
         <MyMessageView
           key={item.msgId} 
           message={item.body}
           time={item.timestamp?.toDate().toLocaleString('en-US', {
             hour: 'numeric',
             minute: 'numeric',
             hour12: true, 
           })}
         />
       );
    } else {
       return (
         <AnotherPersonMessage
           key={item.msgId} 
           message={item.body}
           time={item.timestamp?.toDate().toLocaleString('en-US', {
             hour: 'numeric',
             minute: 'numeric',
             hour12: true, 
           })}
         />
       );
    }
   };
   

  return (
    <ScrollView
      ref={scrollViewRef}
      onContentSizeChange={scrollToEnd}
      showsVerticalScrollIndicator={false}
      className="flex-1 p-3"
    >
      {messages.map((item, index) => renderItem({ item, index }))}
    </ScrollView>
  );
};

export default ChatBody;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3,
  },
});
