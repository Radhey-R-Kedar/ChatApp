import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

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

export const updateAsyncStorageWithChatData = async chatRoomList => {
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
            return {msgId: snap.id, ...snap.data()};
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
