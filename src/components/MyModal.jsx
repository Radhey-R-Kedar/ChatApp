import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import VectorIcon from '../utils/VectorIcon';
import {Colors} from '../theams/Colors';
import {generateRandomCode, getDeviceId} from '../utils/Functions';
import firestore from '@react-native-firebase/firestore';
import {profilePics} from '../utils/Images';

const MyModal = ({showModal, setShowModal, refresh, setRefresh}) => {
  const [createNew, setCreateNew] = useState(false);
  const [id, setId] = useState('');
  const [profilePicId, setProfilePicId] = useState(1);
  const [name, setName] = useState('');
  const createNewId = () => {
    const randomCode = generateRandomCode(8);
    setId(randomCode);
  };

  const onBackPress = () => {
    setShowModal(false);
  };

  const joinExistingChatRoom = () => {
    const deviceId = getDeviceId();

    const collectionRef = firestore().collection('users');
    const docRef = collectionRef.doc(deviceId);
    docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          return docRef
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
              setShowModal(false);
            });
        } else {
          return docRef.set({
            name: name,
            chatrooms: [id],
          });
        }
      })
      .then(() => {
        console.log('Document created or found successfully!');
      })
      .catch(error => {
        console.error('Error getting document:', error);
      });
  };

  const createNewChatRoom = () => {
    const deviceId = getDeviceId();
    firestore()
      .collection('chats')
      .doc(id)
      .set({
        name: name,
        participants: [`users/${deviceId}`],
        profile: `chatroompics/user${profilePicId}.jpeg`,
      })
      .then(() => {
        firestore()
          .collection('users')
          .doc(deviceId)
          .update(
            'chatrooms',
            firestore.FieldValue.arrayUnion(id),
            'mychatrooms',
            firestore.FieldValue.arrayUnion(id),
          )
          .then(() => {
            setShowModal(false);
            console.log('user added!');
          });
      });
  };

  return (
    <Modal transparent={true} visible={showModal} animationType="fade">
      <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
      <View className="flex-1 justify-center items-center">
        <View className="w-[70%] items-center justify-center rounded-3xl border-2 border-black bg-headerColor  pt-3 pb-3">
          <View className="flex flex-row justify-between w-[90%] mb-2">
            <Text className="text-black text-center w-[90%] ">
              Add or create chatroom.
            </Text>
            <VectorIcon
              type="Entypo"
              name="cross"
              size={25}
              color={Colors.mediumGray}
              onPress={() => onBackPress()}
              className=""
            />
          </View>

          <View className="w-[100%] justify-center items-center flex">
            <TextInput
              placeholder="Enter ID"
              placeholderTextColor={Colors.black}
              value={id}
              onChangeText={id => setId(id)}
              className="border-[1px] border-black rounded-md w-[80%] h-10 p-1 text-center text-black"
            />
            {createNew && (
              <>
                <TouchableOpacity
                  className=" items-center justify-end w-[80%] mt-1 mb-1"
                  onPress={createNewId}>
                  <Text className="text-right w-[100%] font-bold text-orange">
                    Auto-Id
                  </Text>
                </TouchableOpacity>
                <TextInput
                  placeholder="Enter Name"
                  placeholderTextColor={Colors.black}
                  value={name}
                  onChangeText={name => setName(name)}
                  className="border-[1px] border-black rounded-md w-[80%] h-10 p-1 text-center text-black"
                />
                <View className="w-[80%] h-20 m-2 justify-center items-center">
                  <Text className="text-black">Select Profile Picture</Text>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    className="mt-1 border-black border-t-[1px] border-b-[1px] w-[100%] rounded-md p-2">
                    {profilePics.map(item => (
                      <TouchableOpacity
                        onPress={() => setProfilePicId(item.id)}
                        key={item.id}>
                        <Image
                          source={item.img}
                          className="h-10 w-10 rounded-full ml-1 mr-1"
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </>
            )}
          </View>

          {createNew ? (
            <TouchableOpacity
              className="border-[1px] border-black rounded-md p-2 m-2 w-[80%] items-center justify-center align-middle bg-statusBar"
              onPress={createNewChatRoom}>
              <Text className="text-black">Create</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="border-[1px] border-black rounded-md p-2 m-2 w-[80%] items-center justify-center align-middle bg-statusBar"
              onPress={joinExistingChatRoom}>
              <Text className="text-black">Add</Text>
            </TouchableOpacity>
          )}

          <Text className="text-black m-1">-----------OR-----------</Text>
          <TouchableOpacity
            className="border-[1px] border-black rounded-md p-2 m-2 w-[80%] items-center justify-center align-middle bg-statusBar"
            onPress={() => setCreateNew(!createNew)}>
            <Text className="text-black text-center">
              {createNew ? 'Add Existing Chartoom' : 'Create New'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
        </TouchableWithoutFeedback>
     
    </Modal>
  );
};

export default MyModal;
