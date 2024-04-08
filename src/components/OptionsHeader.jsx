import { View, Text } from 'react-native'
import React from 'react'
import VectorIcon from '../utils/VectorIcon'
import { Colors } from '../theams/Colors'
import { useDispatch, useSelector } from 'react-redux'
import { deleteChatRoom } from '../utils/FireBaseFunctions'

const OptionsHeader = ({onThreeDotPress,onRefresh}) => {
  const dispatch = useDispatch();
  const chatlist = useSelector(state=>state.chatlist);
  const handleDelete = () => {
    if(chatlist.selectedChatroom!=null){
      deleteChatRoom(chatlist.selectedChatroom);
      dispatch({type:"setSelectedChatRoom", payload: null, selected:false})
      onRefresh();
    }
  }

  const onQRCodePress = () => {
    dispatch({type: 'toggleQRCodeModal'});
  };

  return (
    <View className="flex-row justify-between items-center pl-5 pr-5 bg-HeaderColor pt-3 h-12" >
     <VectorIcon
          type="Ionicon"
          name="arrow-back"
          size={20}
          color={Colors.mediumGray}
          onPress={() => dispatch({type:"setSelectedChatRoom", payload: null, selected:false})}
        />
     <View className ="flex-row justify-between w-28">
     <VectorIcon
          type="FontAwesome"
          name="qrcode"
          size={24}
          color={Colors.mediumGray}
          onPress={() => onQRCodePress()}
        />
     <VectorIcon
          type="MaterialIcons"
          name="delete"
          size={24}
          color={Colors.mediumGray}
          onPress={() => handleDelete()}
        />
        
      <VectorIcon
          type="Entypo"
          name="dots-three-vertical"
          size={20}
          color={Colors.mediumGray}
          onPress={() => onThreeDotPress()}
        />
     </View>
    </View>
  )
}

export default OptionsHeader