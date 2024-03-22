import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const SettingModal = () => {
  const state = useSelector(state =>state.chatlist)
  const dispatch = useDispatch()

  const toggleOptionModal =()=>{
    dispatch({type:'toggleOptionsModal'})
  }
  return (
    <Modal transparent={true} visible={state.showOptionsModal} animationType="fade">
      <TouchableWithoutFeedback onPress={() => toggleOptionModal()}>
        <View className="flex-1"></View>
      </TouchableWithoutFeedback>
      <View className="border-2 border-headerColor rounded-xl bg-headerColor w-40 absolute right-0 top-14 p-2 mr-1">
        <TouchableOpacity onPress={() => console.log('Setting')}>
          <Text className="text-black text-left font-medium text-base p-[2px]">
            Settings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Details')}>
          <Text className="text-black text-left font-medium text-base p-[2px]">
            Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Delete')}>
          <Text className="text-black text-left font-medium text-base p-[2px]">
            Delete
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Add Chatroom')}>
          <Text className="text-black text-left font-medium text-base p-[2px]">
            Add Chatroom
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SettingModal;
