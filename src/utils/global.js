import AsyncStorage from '@react-native-async-storage/async-storage';

export const setAsyncStorageData = async (key, value) => {
  try {
    const jsonString = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonString);
  } catch (err) {
    console.log('\n----- err occurred while setting data -----', err);
  }
};
export const getAsyncStorageData = async key => {
  try {
    const jsonString = await AsyncStorage.getItem(key);

    if (jsonString) {
      return JSON.parse(jsonString);
    } else {
      return null;
    }
  } catch (err) {
    console.log('\n----- err occurred while getting data -----', err);
  }
};
