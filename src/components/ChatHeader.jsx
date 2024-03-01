import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../theams/Colors';
import VectorIcon from '../utils/VectorIcon';
import {useNavigation} from '@react-navigation/native';
import User1 from '../assets/user8.jpeg';

var {width, height} = Dimensions.get('screen');

const ChatHeader = (props) => {
  const navigation = useNavigation();
  return (
    <View
      className="flex-row justify-between items-center pl-5 pr-5 bg-headerColor"
    >
      <VectorIcon
        type="Ionicon"
        name="arrow-back"
        size={20}
        color={Colors.mediumGray}
        onPress={() => navigation.goBack()}
      />
      <View className="p-2 mt-1 mb-1 flex-row items-center w-[90%] ">
        <View className = "border-2 border-orange rounded-full">
        <Image
          source={{uri:props.profile} || User1}
          className="rounded-full h-12 w-12 justify-center items-center"
        />
        </View>
        <View className="ml-2">
          <Text style={styles.name}>{props.name}</Text>
          <Text style={styles.message}>Online</Text>
        </View>
      </View>
      
        <VectorIcon
          type="Entypo"
          name="dots-three-vertical"
          size={20}
          color={Colors.mediumGray}
          onPress={() => navigation.goBack()}
        />
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
