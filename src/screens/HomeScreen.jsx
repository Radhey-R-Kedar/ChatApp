import {
  View,
  Text,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React from 'react';
import Profile from '../assets/homeprofile.jpg';
import {Colors} from '../theams/Colors';
import { useNavigation } from '@react-navigation/native';

var {width, height} = Dimensions.get('window');

const HomeScreen = () => {
 const navigation = useNavigation();
  const handleOnPress =()=>{
    navigation.navigate("ChatListScreen")
  }
  return (
    <View
      className="flex-1, justify-center items-center"
      style={{backgroundColor: Colors.white}}>
        <StatusBar backgroundColor={Colors.statusBar} />
      <View
        style={{height: height * 0.85, width, borderBottomLeftRadius: 1070}}>
        <Image
          source={Profile}
          style={{height: height * 0.85, width, borderBottomLeftRadius: 1070}}
        />
      </View>
      <View
        className="flex-row justify-center items-center"
        style={{height: height * 0.15, width}}>
        <View
          className="border-2 rounded-full justify-center items-center"
          style={{height: height * 0.07, width: width * 0.7}}>
          <TextInput
            placeholderTextColor={Colors.mediumGray}
            placeholder="Enter Id"
            className="text-center font-medium"
            style={{
              color: Colors.mediumGray,
              fontSize: 20,
              width: '90%',
              height: '85%',
            }}
          />
        </View>
        <TouchableOpacity
        onPress={handleOnPress}
          className="border-2 rounded-full ml-3 justify-center"
          style={{
            backgroundColor: Colors.orange,
            height: height * 0.06,
            width: width * 0.2,
          }}>
          <Text className="text-center text-black">Lets Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
