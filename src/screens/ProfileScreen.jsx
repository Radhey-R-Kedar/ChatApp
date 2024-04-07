import {
  View,
  Text,
  Image,
  BackHandler,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import VectorIcon from '../utils/VectorIcon';
import {Colors} from '../theams/Colors';
import Profile from '../assets/user8.jpeg';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {getChatRoomDataFromStorage} from '../utils/AsyncStorageFunctions';
import ProfilePhotoOptions from '../Modals/ProfilePhotoOptions';


const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const chatlist = useSelector(state => state.chatlist);
  const [isEditable, setIsEditable] = useState(false);
  const [editPhoto, setEditPhoto] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null);

  const [profile, setProfile] = useState({
    createdate: '',
    description:
      "Welcome to our cozy chat room! 🌟 Here, you'll find a warm and welcoming space to connect with like-minded individuals. Let's make memories and forge friendships together!",
    id: '',
    ismychatroom: false,
    name: '',
    profile:
      'https://firebasestorage.googleapis.com/v0/b/mychatapp-27983.appspot.com/o/chatroompics%2Fuser10.jpeg?alt=media&token=8130579f-4f3f-4e4a-9b6e-ae631a989362',
    tagline: "Let's forge friendships together!",
  });

  const getChatroomData = async () => {
    const chatRoomData = await getChatRoomDataFromStorage(
      chatlist.selectedChatroom,
    );
    const timestamp = chatRoomData.createdate;
    const milliseconds =
      timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000);
    const date = new Date(milliseconds);
    const updatedProfile = {...chatRoomData, createdate: date};

    setProfile(updatedProfile);
  };

  const [editableProfile, setEditableProfile] = useState({...profile});

  const handleSaveChanges = () => {
    // Logic to save changes
    setProfile(editableProfile);
    // Dispatch actions to update Redux store if necessary
  };

  useEffect(() => {
    getChatroomData();
    const backAction = () => {
      navigation.goBack();
      dispatch({
        type: 'setSelectedChatRoom',
        payload: null,
        selected: false,
      });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View className=" h-12 w-12 justify-center items-center rounded-full absolute top-4 left-4">
          <VectorIcon
            type="Ionicon"
            name="arrow-back"
            size={20}
            color={Colors.mediumGray}
            onPress={() => {
              navigation.goBack();
              dispatch({
                type: 'setSelectedChatRoom',
                payload: null,
                selected: false,
              });
            }}
          />
        </View>
        <View className=" h-12 w-12 justify-center items-center rounded-full absolute top-4 right-4">
          {profile.ismychatroom && (
            <VectorIcon
              type="FontAwesome5"
              name="user-edit"
              size={20}
              color={Colors.mediumGray}
              onPress={() => setIsEditable(isEditable => !isEditable)}
            />
          )}
        </View>

        <View className="flex flex-1 mb-14 pt-10">
          <View className="flex-1 justify-center items-center pt-5">
            <View className="border-[2.5px] border-Orange rounded-full relative">
              {capturedImage!=null ? <Image
                source={{uri: capturedImage}}
                className="w-48 h-48 rounded-full"
              />:
              <Image
                source={{uri: profile?.profile} || Profile}
                className="w-48 h-48 rounded-full"
              />}
              {/* {isEditable && <VectorIcon
                type="FontAwesome5"
                name="camera"
                size={15}
                color={Colors.black}
                className="absolute right-5 bottom-2 bg-Green rounded-md p-1  border-2 border-Orange"
                onPress={() => setEditPhoto(!editPhoto)}
              />} */}
            </View>
            <View className="h-[70%]">
              {!isEditable ? (
                <Text className="text-black text-center mt-2 text-2xl font-bold">
                  {profile?.name}
                </Text>
              ) : (
                <TextInput
                  value={editableProfile.name}
                  onChangeText={text =>
                    setEditableProfile({...editableProfile, name: text})
                  }
                  placeholder={profile?.name}
                  placeholderTextColor={Colors.black}
                  className="text-black text-center mt-2 text-2xl font-bold"
                />
              )}
              <Text className="text-gray-500 text-center text-xs font-bold">
                {profile?.id}
              </Text>
              {!isEditable ? (
                <Text className="text-gray-500 text-lg text-center font-bold  mt-2 pt-1">
                  {profile.tagline}
                </Text>
              ) : (
                <TextInput
                  value={editableProfile.tagline}
                  onChangeText={text =>
                    setEditableProfile({...editableProfile, tagline: text})
                  }
                  placeholder="Tagline"
                  placeholderTextColor={Colors.black}
                  className="text-gray-500 text-lg text-center font-bold  mt-2 pt-1"
                />
              )}
              <View className="flex-1 w-[100vw]  mt-4  pl-3 ">
                <Text className="text-gray-500 text-lg font-bold mt-2">
                  Created At :{' '}
                  <Text className="text-gray-500 text-base font-normal">
                    {profile.createdate.toLocaleString()}
                  </Text>
                </Text>

                <Text className="text-gray-500 text-lg font-bold  mt-2 pt-1">
                  Description
                </Text>
                {!isEditable ? (
                  <Text className="text-gray-500 text-base font-normal mt-1 text-justify w-[92vw]">
                    {profile?.description}
                  </Text>
                ) : (
                  <TextInput
                    value={editableProfile.description}
                    onChangeText={text =>
                      setEditableProfile({
                        ...editableProfile,
                        description: text,
                      })
                    }
                    placeholder="Description"
                    multiline={true}
                    numberOfLines={4}
                    className="text-gray-500 text-base font-normal text-justify"
                  />
                )}
                {isEditable && (
                  <View className="flex-row justify-end items-center mt-2 mr-4">
                    <TouchableOpacity className="justify-center items-center w-20 bg-StatusBar rounded-2xl flex">
                      <Text
                        className="text-white text-lg font-bold text-center p-1"
                        onPress={handleSaveChanges}>
                        Save
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* <ProfilePhotoOptions editPhoto={editPhoto} setEditPhoto ={setEditPhoto} capturedImage={capturedImage} setCapturedImage={setCapturedImage}/> */}
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;
