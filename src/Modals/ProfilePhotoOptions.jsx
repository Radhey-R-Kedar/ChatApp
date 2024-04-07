import {
  View,
  Modal,
  TouchableWithoutFeedback,
  Text,
  Button,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import VectorIcon from '../utils/VectorIcon';
import {Colors} from '../theams/Colors';
import {RNCamera, FaceDetector} from 'react-native-camera';
const ProfilePhotoOptions = ({editPhoto, setEditPhoto,capturedImage, setCapturedImage}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const onBackPress = () => {
    setIsCameraOpen(false);
    setEditPhoto(false);
    setCapturedImage(null); // Clear captured image when going back
  };

  const takePicture = async camera => {
    if (camera) {
      const options = {quality: 0.5, base64: true};
      const data = await camera.takePictureAsync(options);
      setCapturedImage(data.uri); // Save captured image URI
    }
  };

  const handleOkPress = () => {
    setEditPhoto(false);
  };

  return (
    <Modal transparent={true} visible={editPhoto} animationType="fade">
      <TouchableWithoutFeedback onPress={() => onBackPress()}>
        <View className="flex flex-1 relative">
          {isCameraOpen ? (
            <View className="flex flex-1 ">
              <RNCamera
                style={{flex: 1}}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.off}
                captureAudio={false}>
                {({camera, status}) => {
                  if (status !== 'READY') return <View />;
                  return (
                    <View className="absolute bottom-5 left-0 right-0 p-4 flex flex-row justify-between items-center">
                      <View className="bg-StatusBar p-2 rounded-full">
                        <VectorIcon
                          type="MaterialIcons"
                          name="close"
                          size={35}
                          color={Colors.black}
                          onPress={() => setCapturedImage(null)}
                          className=" border-2 rounded-full p-1"
                        />
                      </View>
                      {!capturedImage && (
                        <View className="bg-StatusBar p-3 rounded-full">
                          <VectorIcon
                            type="MaterialIcons"
                            name="camera"
                            size={35}
                            color={Colors.black}
                            onPress={() => takePicture(camera)}
                            className="border-2 rounded-full p-1"
                          />
                        </View>
                      )}

                      <View className="bg-StatusBar p-2 rounded-full">
                        <VectorIcon
                          type="MaterialIcons"
                          name="check"
                          size={35}
                          color={Colors.black}
                          onPress={handleOkPress}
                          className="border-2 rounded-full p-1"
                        />
                      </View>
                    </View>
                  );
                }}
              </RNCamera>
              {capturedImage && (
                <View className="absolute top-0 left-0 right-0 bottom-0 h-50 mb-20 justify-center items-center">
                  <Image
                    source={{uri: capturedImage}}
                    className="h-[100vh] w-full"
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>
          ) : (
            <View className="rounded-t-3xl flex flex-row justify-around items-center bg-StatusBar h-[15%] w-[100%] absolute bottom-0">
              <VectorIcon
                type="MaterialIcons"
                name="close"
                size={35}
                color={Colors.black}
                onPress={onBackPress}
                className="border-2 rounded-full p-1"
              />
              <VectorIcon
                type="MaterialIcons"
                name="photo"
                size={35}
                color={Colors.black}
                onPress={onBackPress}
                className="border-2 rounded-xl p-1"
              />
              <VectorIcon
                type="MaterialIcons"
                name="camera"
                size={35}
                color={Colors.black}
                onPress={() => setIsCameraOpen(true)}
                className="border-2 rounded-full p-1"
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ProfilePhotoOptions;
