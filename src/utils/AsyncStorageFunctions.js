import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {store} from '../redux/store';

export const getChatListDataFromStorage = async () => {
  try {
    const storedChatRoomList = await AsyncStorage.getItem('chatRoomList');
    if (storedChatRoomList !== null) {
      return JSON.parse(storedChatRoomList);
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error loading chat room list:', error);
  }
};

// Function to compare Firebase data with AsyncStorage data and update AsyncStorage if there are changes
export const updateAsyncStorageWithChatListData = async firebaseData => {
  if (firebaseData.length != 0) {
    try {
      // Load data from AsyncStorage
      const storedData = await AsyncStorage.getItem('chatRoomList');
      const asyncStorageData = storedData ? JSON.parse(storedData) : [];

      // Check if there are any differences between Firebase data and AsyncStorage data
      const dataChanged =
        JSON.stringify(firebaseData) !== JSON.stringify(asyncStorageData);
      if (dataChanged) {
        await AsyncStorage.setItem(
          'chatRoomList',
          JSON.stringify(firebaseData),
        );
      }
    } catch (error) {
      console.error('Error updating AsyncStorage with Firebase data:', error);
    }
  }
};

// ChatData Functions

export const updateAsyncStorageWithChatData = async () => {
  const Data = await AsyncStorage.getItem('chatRoomList');
  const chatRoomList = Data ? JSON.parse(Data) : [];

  if (chatRoomList.length != 0) {
    chatRoomList.forEach(async chatRoom => {
      const storedData = await AsyncStorage.getItem(chatRoom.id);
      const asyncStorageData = storedData ? JSON.parse(storedData) : [];

      let lastMessageTimestamp = null;
      if (asyncStorageData.length > 0) {
        lastMessageTimestamp =
          asyncStorageData[asyncStorageData.length - 1].timestamp;

        firestore()
          .collection('chatrooms')
          .doc(chatRoom.id)
          .collection('messages')
          .where('timestamp', '>', lastMessageTimestamp)
          .orderBy('timestamp')
          .onSnapshot(snapShot => {
            const newMessages = snapShot.docs.map(snap => {
              return {...snap.data()};
            });

            if (newMessages.length > 0) {
              AsyncStorage.setItem(
                chatRoom.id,
                JSON.stringify([...asyncStorageData, ...newMessages]),
              );
              console.log('New messages added to AsyncStorage.');
            } else {
              console.log('No new messages found.');
            }
          });
      }
    });
  }
};

// get chatRoom information from async storage

export const getChatRoomDataFromStorage = async desiredId => {
  try {
    const storedChatRoomList = await AsyncStorage.getItem('chatRoomList');
    if (storedChatRoomList !== null) {
      const data = JSON.parse(storedChatRoomList);
      let foundData = null;
      for (const item of data) {
        if (item.id === desiredId) {
          foundData = item;
          break;
        }
      }
      return foundData;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error loading chat room list:', error);
  }
};

// updateAsyncStorageWithChatDataInChatRoom
export const updateAsyncStorageWithChatDataInChatRoom = async chatRoomId => {
  try {
    console.log(chatRoomId);
    const state = store.getState();
    const chatData = await state.chatdata[`newMsgArr_${chatRoomId}`];
    console.log(state.chatdata.lastMessageTimestamps[`timestamp_${chatRoomId}`]);

    if (chatData !== undefined) {
      const storedData = await AsyncStorage.getItem(chatRoomId);
      const asyncStorageData = storedData ? JSON.parse(storedData) : [];

      // console.log(asyncStorageData);
      if(chatData.length>0){
        await AsyncStorage.setItem(
          chatRoomId,
          JSON.stringify([...asyncStorageData, ...chatData]),
        );
        console.log('Chatroom data updated successfully in AsyncStorage.');
      } else {
        console.log('No new chat data to update in AsyncStorage.');
      }
    } else {
      console.log('No chat data to update in AsyncStorage.');
    }
  } catch (error) {
    console.error('Error updating AsyncStorage with chat data:', error);
  }
};

