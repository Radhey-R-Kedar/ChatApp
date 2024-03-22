import {FlatList, RefreshControl, ScrollView, Text, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import ChatListItem from './ChatListItem';
import {useDispatch, useSelector} from 'react-redux';

const ChatListBody = ({onRefresh, isMyChats}) => {
  const navigation = useNavigation();
  const dispatch =useDispatch();

  const chatlist = useSelector(state => state.chatlist);

  const handleOnChatPress = (roomId, name, profile) => {
    if(chatlist.isChatRoomSelected){
      dispatch({type:"setSelectedChatRoom", payload: roomId, selected:true})
    }else{
      navigation.navigate('ChatScreen', (roomId = {roomId, name, profile}));
    }
  };

  const handleOnChatLongPress = roomId => {
    dispatch({type:"setSelectedChatRoom", payload: roomId, selected:true})
  };

  const renderItem = ({item}) => {
    const isSelected = item.id === chatlist.selectedChatroom;
    if (isMyChats) {
      return (
        item.ismychatroom && (
          <ChatListItem
            item={item}
            handleOnChatLongPress={handleOnChatLongPress}
            handleOnChatPress={handleOnChatPress}
            isSelected={isSelected}
          />
        )
      );
    } else {
      return (
        <ChatListItem
          item={item}
          handleOnChatLongPress={handleOnChatLongPress}
          handleOnChatPress={handleOnChatPress}
          isSelected={isSelected}
        />
      );
    }
  };

  return (
    <>
      <View className="flex-1  pl-1 pr-2">
        {chatlist.chatRoomList.length == 0 ? (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={chatlist.refreshing}
                onRefresh={onRefresh}
              />
            }>
            <View  className="mt-60 justify-center items-center">
            <Text className="text-mediumGray font-bold text-2xl">
              Welcome to Chit-Chat
            </Text>
            <Text className="text-mediumGray font-semibold text-sm">
              Anonymous Chat Application
            </Text>
            </View>
          </ScrollView>
        ) : (
          <>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={chatlist.refreshing}
                  onRefresh={onRefresh}
                />
              }
              data={chatlist.chatRoomList}
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
