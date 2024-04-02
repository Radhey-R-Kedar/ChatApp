import firestore from '@react-native-firebase/firestore';
import {getDeviceId, getImage} from './Functions';

// hatListFunctions

export const fetchChatListData = async () => {
  try {
    const userId = getDeviceId();
    const userDocRef = firestore().collection('users').doc(userId);
    const userData = await userDocRef.get();

    const userChatData = userData.data();
    if (userChatData) {
      const allChatRooms = userChatData.chatrooms;
      const myChatRooms = new Set(userChatData.mychatrooms);

      const chatRoomData = await Promise.all(
        allChatRooms.map(async room => {
          const roomRef = await firestore()
            .collection('chatrooms')
            .doc(room)
            .get();
          const data = roomRef.data();
          const id = roomRef.id;
          const name = data.name;
          const profile = await getImage(data.profile);
          const createdate = data.createdate;
          const description = data.description;
          const tagline = data.tagline;
          const ismychatroom = myChatRooms.has(room);
          return {id, name, profile, ismychatroom, createdate, description, tagline};
        }),
      );
      return {status: 'success', data: chatRoomData};
    }
    return {status: 'no data'};
  } catch (error) {
    console.error('An error occurred while fetching chat rooms:', error);
    return {status: 'error', error};
  }
};

// Modal functions

export const joinExistingChatRoom = (id, isOnline) => {
  return new Promise((resolve, reject) => {
    if (isOnline) {
      if (id.length == 0) {
        resolve('Please Enter Id');
      }
      const deviceId = getDeviceId();

      const usersCollectionRef = firestore().collection('users');
      const userDocRef = usersCollectionRef.doc(deviceId);

      firestore()
        .collection('chatrooms')
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
                      .collection('chatrooms')
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
    } else {
      resolve('Offline.. Please check Network Connection');
    }
  });
};

export const createNewChatRoom = (id, profilePicId, name, isOnline) => {
  return new Promise((resolve, reject) => {
    if (isOnline) {
      const deviceId = getDeviceId();
      const userRef = firestore().collection('users').doc(deviceId);

      userRef
        .get()
        .then(docSnapshot => {
          if (docSnapshot.exists) {
            // User exists, update the user document
            return userRef.update({
              chatrooms: firestore.FieldValue.arrayUnion(id),
              mychatrooms: firestore.FieldValue.arrayUnion(id),
            });
          } else {
            // User doesn't exist, create a new user document
            return userRef.set({
              // Set initial user data here if needed
              chatrooms: [id],
              mychatrooms: [id],
            });
          }
        })
        .then(() => {
          // After updating or creating user document, create chat room
          return firestore()
            .collection('chatrooms')
            .doc(id)
            .set({
              name: name,
              participants: [`users/${deviceId}`],
              profile: `chatroompics/user${profilePicId}.jpeg`,
              createdate: firestore.FieldValue.serverTimestamp(),
              tagline: "Let's forge friendships together!",
              description: "Welcome to our cozy chat room! 🌟 Here, you'll find a warm and welcoming space to connect with like-minded individuals. Let's make memories and forge friendships together!",
            });
        })
        .then(() => {
          console.log('User and chat room added successfully!');
          resolve('success');
        })
        .catch(error => {
          console.error('Error:', error);
          reject(error);
        });
    } else {
      resolve('Offline.. Please check Network Connection');
    }
  });
};

// option button functions
export const deleteChatRoom = id => {
  return new Promise(async (resolve, reject) => {
    const deviceId = getDeviceId();
    console.log(deviceId);
    const userRef = await firestore().collection('users').doc(deviceId);
    userRef
      .get()
      .then(docSnapshot => {
        //if chroom contains id then only delete from user document
        if (docSnapshot.data().mychatrooms.includes(id)) {
          return userRef.update({
            mychatrooms: firestore.FieldValue.arrayRemove(id),
            chatrooms: firestore.FieldValue.arrayRemove(id),
          });
        } else if (docSnapshot.data().chatrooms.includes(id)) {
          return userRef.update({
            chatrooms: firestore.FieldValue.arrayRemove(id),
          });
        }
      })
      .then(() => {
        // After updating or creating user document, create chat room
        return firestore().collection('chatrooms').doc(id).delete();
      });
  });
};
