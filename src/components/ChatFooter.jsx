import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../theams/Colors';
import VectorIcon from '../utils/VectorIcon';
import firestore from '@react-native-firebase/firestore';

var {width, height} = Dimensions.get('screen');

const ChatFooter = ({userId, chatRef}) => {
  const [currMessage, setCurrMessage] = useState('');
  const [sendEnable, setSendEnable] = useState(false);

  const onChange = value => {
    setCurrMessage(value);
    value.length > 0 ? setSendEnable(true) : setSendEnable(false);
  };

  const onSendMessage = () => {
    chatRef.collection('messages').add({
      body: currMessage,
      sender: userId,
      timestamp: firestore.FieldValue.serverTimestamp(),
    });
    setSendEnable(false);
    setCurrMessage('');
  };

  return (
    <View className="flex flex-row  items-center flex-wrap p-2">
      <View className="flex flex-row border-orange border-[1px] rounded-2xl w-[85%] p-1">
        <View className="w-[8%] items-center mr-2 ">
          <VectorIcon
            type="MaterialIcons"
            name="emoji-emotions"
            size={25}
            color={Colors.mediumGray}
            className=""
          />
        </View>
        <TextInput
          multiline
          placeholder="Message"
          placeholderTextColor={Colors.mediumGray}
          className="text-black w-[79%] max-h-24 p-[-1px]"
          value={currMessage}
          onChangeText={text => onChange(text)}
        />
        <View className="w-[8%] items-center">
          <VectorIcon
            type="FontAwesome"
            name="photo"
            size={20}
            color={Colors.mediumGray}
            className="mt-[3px]"
          />
        </View>
      </View>

      <TouchableOpacity
        className="w-[8%] justify-center items-center ml-3"
        onPress={() => (sendEnable ? onSendMessage() : null)}>
        <VectorIcon
          type="FontAwesome"
          name="paper-plane"
          size={20}
          color={Colors.white}
          className="bg-orange w-12 h-12 rounded-3xl justify-center items-center "
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChatFooter;
