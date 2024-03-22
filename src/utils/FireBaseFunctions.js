import firestore from '@react-native-firebase/firestore';
import {getDeviceId, getImage} from './Functions';

export const fetchChatListData = async () => {
  const userData = await fetchChatList();
  const allChatRooms = userData.chatrooms;
  const myChatRooms = userData.mychatrooms;

  const chatRoomData = await Promise.all(
    allChatRooms.map(async room => {
      const roomRef = await firestore().collection('chats').doc(room).get();
      const data = roomRef.data();
      const id = roomRef.id;
      const name = data.name;
      const profile = await getImage(data.profile);
      const ismychatroom = myChatRooms?.includes(room) ? true : false;
      return {id, name, profile, ismychatroom};
    }),
  );

  return chatRoomData;
};

const fetchChatList = async () => {
  const userId = getDeviceId();
  try {
    const chatRef = await firestore().collection('users').doc(userId).get();
    const userData = chatRef.data();
    if (userData == undefined) {
      return await fetchChatList();
    }
    return userData;
  } catch (err) {
    console.log('New Error', err);
  }
};

export const joinExistingChatRoom = id => {
  return new Promise((resolve, reject) => {
    if(id.length ==0 ){
      resolve("Please Enter Id")
    }
    const deviceId = getDeviceId(); 

    const usersCollectionRef = firestore().collection('users');
    const userDocRef = usersCollectionRef.doc(deviceId);

    firestore()
      .collection('chats')
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          userDocRef.get().then(userDoc => {
            if (userDoc.exists) {
              userDocRef
                .update({
                  chatrooms: firestore.FieldValue.arrayUnion(id),
                })
                .then(() => {
                  return firestore()
                    .collection('chats')
                    .doc(id)
                    .update({
                      chatrooms: firestore.FieldValue.arrayUnion(id),
                    });
                })
                .then(() => {
                  resolve('success'); 
                })
                .catch(error => {
                  console.error('Error updating document:', error);
                  reject(error); 
                });
            } else {
              console.log('User document does not exist.');
              resolve('user_not_found'); 
            }
          });
        } else {
          console.log('Chatroom does not exist.');
          resolve('Please Enter Valid Id'); 
        }
      })
      .catch(error => {
        console.error('Error getting chatroom document:', error);
        reject(error); 
      });
  });
};


export const createNewChatRoom = (id, profilePicId, name) => {
  return new Promise((resolve, reject) => {
     const deviceId = getDeviceId(); // Ensure this function is defined and returns the correct device ID
 
     firestore().collection('chats').doc(id).set({
       name: name,
       participants: [`users/${deviceId}`],
       profile: `chatroompics/user${profilePicId}.jpeg`,
     })
     .then(() => {
       return firestore().collection('users').doc(deviceId).update({
         chatrooms: firestore.FieldValue.arrayUnion(id),
         mychatrooms: firestore.FieldValue.arrayUnion(id),
       });
     })
     .then(() => {
       console.log('User added successfully!');
       resolve('success'); // Resolve the promise with 'success' status
     })
     .catch(error => {
       console.error('Error adding user:', error);
       reject(error); // Reject the promise with the error
     });
  });
 };