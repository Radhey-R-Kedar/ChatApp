import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
   } from 'react-native';
   import React, {useEffect, useRef} from 'react';
   import {profilePics} from '../../utils/Images';
   import {useDispatch, useSelector} from 'react-redux';
   import {FlatList} from 'react-native-gesture-handler';
   
   const ProfilePicSelector = () => {
    const chatroom = useSelector(state => state.chatroom);
    const dispatch = useDispatch();
    const flatListRef = useRef(null);

    // Assuming each item takes up 10% of the screen width for simplicity
    const {height,width} =Dimensions.get('window');
    const ITEM_WIDTH = width * 0.1;
   
    // Calculate the middle index
    const middleIndex = Math.floor(profilePics.length / 2);
    const middleItemId = profilePics[middleIndex].id;
   
    useEffect(() => {
       // Dispatch action to select the middle item by default
       dispatch({
         type: 'setProfilePicId',
         payload: middleItemId,
       });
    }, [dispatch]);
   
    // Function to scroll to the selected item
    const scrollToSelectedItem = (selectedId) => {
       const index = profilePics.findIndex(item => item.id === selectedId);
       if (index !== -1 && flatListRef.current) {
         flatListRef.current.scrollToIndex({ animated: true, index });
       }
    };
   
    useEffect(() => {
       // Scroll to the selected item when the component mounts or the selected item changes
       scrollToSelectedItem(chatroom.profilePicId);
    }, [chatroom.profilePicId]);
   
    const renderItem = ({item}) => {
       return (
         <TouchableOpacity
           onPress={() =>
             dispatch({
               type: 'setProfilePicId',
               payload: item.id,
             })
           }
           className={`${chatroom.profilePicId=== item.id ?"border-2 rounded-full border-orange":""}`}
           key={item.id}>
           <Image
             source={item.img}
             className={`h-10 w-10 rounded-full  mt-2 mb-2 ml-1 mr-1 ${
               chatroom.profilePicId === item.id
                 ? 'z-50 h-14 w-14 mt-0 mb-0 ml-0 mr-0'
                 : ''
             }`}
           />
         </TouchableOpacity>
       );
    };
   
    
   
    return (
       <View className="mt-1 border-black border-t-[1px] border-b-[1px] w-[100%] justify-center items-center p-1">
         <FlatList
           ref={flatListRef}
           data={profilePics}
           renderItem={renderItem}
           keyExtractor={item => item.id.toString()}
           horizontal={true}
           showsHorizontalScrollIndicator={false}
           snapToInterval={Dimensions.get('window').width / 2} // Assuming each item takes half the screen width
           snapToAlignment={"center"}
           getItemLayout={(data, index) => (
             {length: ITEM_WIDTH, offset: ITEM_WIDTH * index, index}
           )}
         />
       </View>
    );
   };
   
   export default ProfilePicSelector;
   