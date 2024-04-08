import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import VectorIcon from '../utils/VectorIcon';
import {Colors} from '../theams/Colors';

import {useDispatch, useSelector} from 'react-redux';
import {joinExistingChatRoom} from '../utils/FireBaseFunctions';
import QRCode from 'react-native-qrcode-svg';
import chatAppLogo from '../assets/chatAppLogo.png';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

const QRCodeModal = ({onRefresh}) => {
  const chatlist = useSelector(state => state.chatlist);
  const chatroom = useSelector(state => state.chatroom);
  const userinfo = useSelector(state => state.userinfo);

  const [scanQR, setScanQR] = useState(false);

  useEffect(() => {
    chatlist.isChatRoomSelected ? setScanQR(false) : setScanQR(true);
  }, [chatlist.isChatRoomSelected]);

  const dispatch = useDispatch();

  const chatRoomId = chatlist.selectedChatroom;

  const onBackPress = () => {
    dispatch({type: 'toggleQRCodeModal'});
  };

  const handleJoinExistingChatRoom = async scannedId => {
    joinExistingChatRoom(scannedId, userinfo.isOnline)
      .then(status => {
        dispatch({type: 'setStatus', payload: status});
        if (status == 'success') {
          onRefresh();
          onBackPress();
          dispatch({type: 'clearAllData'});
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const onSuccess = async qrdata => {
    if (qrdata != undefined) {
      handleJoinExistingChatRoom(qrdata.data);
    } else {
      console.log('No data');
    }
  };
  return (
    <Modal
      transparent={true}
      visible={chatlist.showQRCodeModal}
      animationType="fade">
      <TouchableWithoutFeedback onPress={() => onBackPress()}>
        <View className="flex-1 justify-center items-center">
          <View className="w-[80%] h-[50%] items-center justify-center rounded-3xl border-2 border-black bg-HeaderColor">
            {chatlist.isChatRoomSelected ? (
              <View className="flex-row w-[100%] h-[15%] ">
                <View
                  className={`flex justify-center items-center w-[50%] ${
                    !scanQR ? 'border-b-2' : ''
                  }`}>
                  <VectorIcon
                    type="FontAwesome"
                    name="qrcode"
                    size={35}
                    color={Colors.mediumGray}
                    onPress={() => setScanQR(false)}
                  />
                </View>
                <View
                  className={`flex justify-center items-center w-[50%] ${
                    scanQR ? 'border-b-2' : ''
                  }`}>
                  <VectorIcon
                    type="AntDesign"
                    name="scan1"
                    size={35}
                    color={Colors.mediumGray}
                    onPress={() => setScanQR(true)}
                  />
                </View>
              </View>
            ) : (
              <Text className="text-center font-medium text-xl mb-2 text-black">
                Scan QR Code
              </Text>
            )}
            <View className="h-[80%] justify-center items-center">
              {scanQR ? (
                <QRCodeScanner
                  onRead={onSuccess}
                  flashMode={RNCamera.Constants.torch}
                  cameraStyle={{
                    width: 220,
                    height: 250,
                    position: 'absolute',
                    alignSelf: 'center',
                  }}
                />
              ) : (
                <QRCode
                  value={
                    chatlist.selectedChatroom != null
                      ? chatlist.selectedChatroom
                      : ''
                  }
                  logo={chatAppLogo}
                  logoSize={60}
                  size={250}
                />
              )}
            </View>
            <Text className="text-center font-medium text-xs m-2 text-black">
              {chatroom.status}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default QRCodeModal;
