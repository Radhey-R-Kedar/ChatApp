import {
  Dimensions,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../theams/Colors';
import {useNavigation} from '@react-navigation/native';
import ChatListItem from './ChatListItem';
import {useDispatch, useSelector} from 'react-redux';

var {width, height} = Dimensions.get('screen');

const ChatListBody = ({fetchChatListAndUpdateState, isMyChats}) => {
  
  const navigation = useNavigation();
  
  const dispatch = useDispatch();

  const state = useSelector(state => state.chatlist);
  
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
      fetchChatListAndUpdateState(dispatch);
      setRefreshing(false);
    }, 1000);
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
      <View className="flex-1  pl-1 pr-2">
        {state.chatRoomList == undefined ? (
          <View
            className="mt-60 justify-center items-center"
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
              data={state.chatRoomList}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </>
        )}
      </View>
    </>
  );
};


export default ChatListBody;
