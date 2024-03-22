import { View, Text } from 'react-native'
import React from 'react'
import VectorIcon from '../utils/VectorIcon'
import { Colors } from '../theams/Colors'
import { useDispatch } from 'react-redux'

const OptionsHeader = ({onThreeDotPress}) => {
  const dispatch = useDispatch();
  return (
    <View className="flex-row justify-between items-center pl-5 pr-5 bg-headerColor pt-3 h-12" >
     <VectorIcon
          type="Ionicon"
          name="arrow-back"
          size={20}
          color={Colors.mediumGray}
          onPress={() => dispatch({type:"setSelectedChatRoom", payload: null, selected:false})}
        />
     <View className ="flex-row justify-between w-16">
     <VectorIcon
          type="MaterialIcons"
          name="delete"
          size={24}
          color={Colors.mediumGray}
          onPress={() => dispatch({type:"setSelectedChatRoom", payload: null, selected:false})}
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