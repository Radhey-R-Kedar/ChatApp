import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Colors} from '../theams/Colors';
import VectorIcon from '../utils/VectorIcon';
import {useNavigation} from '@react-navigation/native';
import User1 from '../assets/user8.jpg';
import {useDispatch, useSelector} from 'react-redux';
import {updateAsyncStorageWithChatDataInChatRoom} from '../utils/AsyncStorageFunctions';

var {width, height} = Dimensions.get('screen');

const ChatHeader = props => {
  console.log('ChatHeader reloaded');
  const navigation = useNavigation();
  const roomId = props.roomId;
  const dispatch = useDispatch();

  const handleOnSowProfile = () => {
    navigation.navigate('ProfileScreen');
    dispatch({type: 'setSelectedChatRoom', payload: roomId, selected: true});
  };

  const handleOnBackPress = async () => {
    navigation.navigate('ChatListScreen');
    updateAsyncStorageWithChatDataInChatRoom(roomId);
  };

  return (
    <View className="flex-row justify-between items-center pl-5 pr-5 bg-HeaderColor">
      <VectorIcon
        type="Ionicon"
        name="arrow-back"
        size={20}
        color={Colors.mediumGray}
        onPress={() => handleOnBackPress()}
      />
      <View className="p-2 mt-1 mb-1 flex-row items-center w-[90%]">
        <TouchableOpacity
          className="border-2 border-Orange rounded-full"
          onPress={() => handleOnSowProfile()}>
          <Image
            source={{uri: props.profile} || User1}
            className="rounded-full h-12 w-12 justify-center items-center"
          />
        </TouchableOpacity>
        <View className="ml-2">
          <Text style={styles.name}>{props.name}</Text>
          <Text style={styles.message}>Online</Text>
        </View>
      </View>

      {/* <VectorIcon
          type="Entypo"
          name="dots-three-vertical"
          size={20}
          color={Colors.mediumGray}
          onPress={() => navigation.goBack()}
        /> */}
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  name: {
    color: Colors.black,
    fontSize: 22,
    fontWeight: 'bold',
  },
  message: {
    color: Colors.mediumGray,
    fontSize: 12,
  },
});
