import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React from 'react';
import {Colors} from '../theams/Colors';

var {width, height} = Dimensions.get('screen');

const ChatListItem = ({
  item,
  handleOnChatLongPress,
  handleOnChatPress,
  isSelected,
}) => {
  return (
   
    <TouchableOpacity
      onPress={() => handleOnChatPress(item.id, item.name, item.profile)}
      onLongPress={() => handleOnChatLongPress(item.id)}>
      <View className={`p-2 mt-1 mb-1 flex-row justify-between items-center ${isSelected ? 'bg-headerColor' : ''}`}>
        <Image
          source={{uri: item.profile} || User1}
          className="rounded-full h-16 w-16 border-4 justify-center items-center"
          style={styles.profileImage}
        />
        <View style={styles.innerConatiner}>
          <Text style={styles.name}>{item.name || 'ChatRoom'}</Text>
          <Text style={styles.message}>Hi</Text>
        </View>
        <View className="justify-center items-cente mr-2">
          <Text className="text-black text-center justify-center">
            09:20 PM
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  innerConatiner: {
    width: width * 0.55,
    height: '90%',
    paddingLeft: 10,
  },
  profileImage: {
    borderColor: Colors.orange,
    borderWidth: 2,
  },
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

export default ChatListItem;
