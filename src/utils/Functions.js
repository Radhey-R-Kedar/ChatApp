import storage from '@react-native-firebase/storage';
import DeviceInfo from 'react-native-device-info';

export const generateRandomCode = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return result;
  }

export const getImage = async filePath => {
  try {
    const url = await storage().ref(filePath).getDownloadURL();
    return url;
  } catch (error) {
    console.log('Error getting image:c', error);
  }
};

export const getDeviceId = () => {
  try {
    const uniqueId = DeviceInfo.getUniqueId();
    return uniqueId['_j'];
  } catch (error) {
    console.log('Error getting deviceId:c', error);
    throw error;
  }
};