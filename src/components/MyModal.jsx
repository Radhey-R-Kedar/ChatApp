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
import React, {startTransition, useEffect, useState} from 'react';
import VectorIcon from '../utils/VectorIcon';
import {Colors} from '../theams/Colors';
import {generateRandomCode, getDeviceId} from '../utils/Functions';
import firestore from '@react-native-firebase/firestore';
import {profilePics} from '../utils/Images';
import {useDispatch, useSelector} from 'react-redux';
import {
  createNewChatRoom,
  joinExistingChatRoom,
} from '../utils/FireBaseFunctions';

const MyModal = () => {
  const chatlist = useSelector(state => state.chatlist);
  const chatroom = useSelector(state => state.chatroom);
  const dispatch = useDispatch();

  const createNewId = () => {
    const randomCode = generateRandomCode(8);
    dispatch({type: 'setId', payload: randomCode});
  };

  const onBackPress = () => {
    dispatch({type: 'toggleAddUserModal'});
  };

  const handleJoinExistingChatRoom = async () => {
    joinExistingChatRoom(chatroom.id)
      .then(status => {
        dispatch({type: 'setStatus', payload: status});
        if (status == 'success') {
          onBackPress();
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleCreateNewChatRoom = async () => {
    createNewChatRoom(chatroom.id, chatroom.profilePicId, chatroom.name)
      .then(status => {
        dispatch({type: 'setStatus', payload: status});
        if (status == 'success') {
          onBackPress();
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <Modal
      transparent={true}
      visible={chatlist.showAddUserModal}
      animationType="fade">
      <TouchableWithoutFeedback onPress={() => onBackPress()}>
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
                value={chatroom.id}
                onChangeText={id => dispatch({type: 'setId', payload: id})}
                className="border-[1px] border-black rounded-md w-[80%] h-10 p-1 text-center text-black"
              />
              {chatroom.createNew && (
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
                    value={chatroom.name}
                    onChangeText={name =>
                      dispatch({type: 'setName', payload: name})
                    }
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
                          onPress={() =>
                            dispatch({
                              type: 'setProfilePicId',
                              payload: item.id,
                            })
                          }
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
            {chatroom.createNew ? (
              <TouchableOpacity
                className="border-[1px] border-black rounded-md p-2 m-2 w-[80%] items-center justify-center align-middle bg-statusBar"
                onPress={handleCreateNewChatRoom}>
                <Text className="text-black">Create</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="border-[1px] border-black rounded-md p-2 m-2 w-[80%] items-center justify-center align-middle bg-statusBar"
                onPress={handleJoinExistingChatRoom}>
                <Text className="text-black">Add</Text>
              </TouchableOpacity>
            )}
            <Text className="text-black m-1">-----------OR-----------</Text>
            <TouchableOpacity
              className="border-[1px] border-black rounded-md p-2 m-2 w-[80%] items-center justify-center align-middle bg-statusBar"
              onPress={() => dispatch({type: 'toogleCreateNew'})}>
              <Text className="text-black text-center">
                {chatroom.createNew ? 'Add Existing Chartoom' : 'Create New'}
              </Text>
            </TouchableOpacity>
            {chatroom.status && (
              <Text className="text-mediumGray m-1">{chatroom.status}</Text>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default MyModal;
