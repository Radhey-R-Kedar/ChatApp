import {Dimensions, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../theams/Colors';
import VectorIcon from '../utils/VectorIcon';
import {useDispatch} from 'react-redux';

var {width, height} = Dimensions.get('screen');
const ChatListHeader = ({onThreeDotPress}) => {
  const dispatch = useDispatch();
  const onScanPress = () => {
    dispatch({type: 'toggleQRCodeModal'});
  }
  return (
    <View className="flex-row justify-between items-center pl-5 pr-5 bg-HeaderColor pt-3">
      <VectorIcon
        type="AntDesign"
        name="scan1"
        size={20}
        color={Colors.mediumGray}
        onPress={() => onScanPress()}
      />
      <Text className="text-black text-center font-medium text-3xl">
        Chit-Chat
      </Text>
      <VectorIcon
        type="Entypo"
        name="dots-three-vertical"
        size={20}
        color={Colors.mediumGray}
        onPress={() => onThreeDotPress()}
      />
    </View>
  );
};

export default ChatListHeader;
