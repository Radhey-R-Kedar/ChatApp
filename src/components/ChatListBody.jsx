import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../theams/Colors';
import {ChatListData} from '../data/ChatListData';
import {useNavigation} from '@react-navigation/native';
import {getDeviceId} from '../utils/Functions';
import VectorIcon from '../utils/VectorIcon';
import ChatListItem from './ChatListItem';

var {width, height} = Dimensions.get('screen');

const ChatListBody = ({
  chatRoomList,
  fetchChatListData,
  setChatRoomList,
  isMyChats,
}) => {
  const navigation = useNavigation();

  const handleOnChatPress = (roomId, name, profile) => {
    navigation.navigate('ChatScreen', (roomId = {roomId, name, profile}));
  };

  const handleOnChatLongPress = id => {
    console.log(id);
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      const userId = getDeviceId();
      fetchChatListData(userId)
        .then(data => {
          setChatRoomList(data);
          setRefreshing(false);
        })
        .catch(err => console.log('Useeffect ' + err));
    }, 2);
  }, []);

  const renderItem = ({item}) => {

    if (isMyChats) {
      return (
        item.ismychatroom && (
          <ChatListItem
          item={item}
          handleOnChatLongPress={handleOnChatLongPress}
          handleOnChatPress={handleOnChatPress}
        />
        )
      );
    } else {
      return (
        <ChatListItem
          item={item}
          handleOnChatLongPress={handleOnChatLongPress}
          handleOnChatPress={handleOnChatPress}
        />
      );
    }
  };

  return (
    <>
      <View style={styles.container} className="flex-1  pl-1 pr-2">
        {chatRoomList == undefined ? (
          <View className="mt-60 justify-center items-center"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
            <Text className="text-mediumGray font-bold text-2xl">
              Welcome to Chit-Chat
            </Text>
            <Text className="text-mediumGray font-semibold text-sm">
              Anonymous Chat Application
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              data={chatRoomList}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  innerConatiner: {
    width: width * 0.55,
    height: '90%',
    paddingLeft: 10,
  },
  profileImage: {
    borderColor: Colors.orange,
    borderWidth: 2,
  },
  name: {
    color: Colors.black,
    fontSize: 22,
    fontWeight: 'bold',
  },
  message: {
    color: Colors.mediumGray,
    fontSize: 12,
  },
});

export default ChatListBody;
