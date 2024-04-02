import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  BackHandler,
} from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteChatRoom } from '../utils/FireBaseFunctions';
import { useNavigation } from '@react-navigation/native';

const SettingModal = ({onAddUser}) => {
  const chatlist = useSelector(state =>state.chatlist)
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      yourFunction();
      return true; 
    };    

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const yourFunction = () => {
    dispatch({type:"setSelectedChatRoom", payload: null, selected:false})
  };

  const handleAddChatRoom =()=>{
    onAddUser();
    dispatch({type:"toggleOptionsModal"});
  }

  const toggleOptionModal =()=>{
    dispatch({type:'toggleOptionsModal'})
  }

  const handleDelete = async () => {
    if(chatlist.selectedChatroom!=null){
      deleteChatRoom(chatlist.selectedChatroom);
      dispatch({type:"setSelectedChatRoom", payload: null, selected:false})
    }else{
      console.log('Delete Work should be done'); await AsyncStorage.clear();
    }
    dispatch({type: 'toggleOptionsModal'});
  }

  const handleDetails =async () => {
    if(chatlist.selectedChatroom!=null){
      navigation.navigate('ProfileScreen')
    }
    dispatch({type: 'toggleOptionsModal'});
  };
  return (
    <Modal transparent={true} visible={chatlist.showOptionsModal} animationType="fade">
      <TouchableWithoutFeedback onPress={() => toggleOptionModal()}>
        <View className="flex-1"></View>
      </TouchableWithoutFeedback>
      <View className="border-2 border-red-200 rounded-xl bg-HeaderColor w-36 absolute right-0 top-14 p-2 mr-3">
        <TouchableOpacity onPress={() => console.log('Setting')}>
          <Text className="text-black text-left font-medium text-base p-[2px]">
            Settings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDetails()}>
          <Text className="text-black text-left font-medium text-base p-[2px]">
            Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={async () => handleDelete()}>
          <Text className="text-black text-left font-medium text-base p-[2px]">
            Delete
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAddChatRoom()}>
          <Text className="text-black text-left font-medium text-base p-[2px]">
            Add ChatRoom
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SettingModal;
