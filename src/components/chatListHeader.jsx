import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../theams/Colors'
import VectorIcon from '../utils/VectorIcon'
import { useNavigation } from '@react-navigation/native';

var {width, height} = Dimensions.get('screen');
const ChatListHeader = ({onAddUser,onThreeDotPress}) => {
    const navigation = useNavigation();
  return (
    <View className="flex-row justify-between items-center pl-5 pr-5 bg-headerColor pt-3" >
     <VectorIcon
          type="Octicons"
          name="person-add"
          size={20}
          color={Colors.mediumGray}
          onPress={() => onAddUser()}
        />
      <Text className="text-black text-center font-medium text-3xl">Chit-Chat</Text>
      <VectorIcon
          type="Entypo"
          name="dots-three-vertical"
          size={20}
          color={Colors.mediumGray}
          onPress={() => onThreeDotPress()}
        />
    </View>
  )
}

export default ChatListHeader

const styles = StyleSheet.create({
    container:{
      backgroundColor:'#fae4e3',
      height:height*0.08
    },
   
})