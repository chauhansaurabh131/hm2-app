import axios from 'axios';
import {globalUse} from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const auth = async (path, method, data) => {
  const accessToken = await AsyncStorage.getItem(globalUse.ACCESSTOKEN);
  try {
    let config =
      method === 'POST'
        ? {
            url: path,
            method: method,
            headers: {
              'Content-Type': 'application/json',
            },
            data: data,
          }
        : method === 'PUT'
        ? {
            url: path,
            method: method,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            data: data,
          }
        : {
            url: path,
            method: method,
            headers: {
              'Content-Type': 'application/json',
            },
          };

    console.log(' === config ===> ', config);

    const response = await axios.request(config);
    console.log(' === response.data.message.... ===> ', response.data.message);
    if (response?.status === 200) {
      return response;
    } else {
      console.error(Error);
      throw Error;
    }
  } catch (e) {
    console.log(' === Error Message ===> ', e.response.data.message);
    return e.response.data.message;
  }
};

const afterAuth = (path, method, data) => {
  try {
    let params =
      method == 'UPDATE'
        ? {
            method: method,
            header: {},
            data: data,
          }
        : {};
    const response = axios(params);
    if (response.code == 200) {
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
};

module.exports = {
  async userRegistration(params) {
    return await auth(params.Path, 'POST', params?.Data).catch(e => {
      console.error(e);
      return e;
    });
  },
  async userLogin(params) {
    console.log(' === params in userLogin  ===> ', params);
    return await auth(params.Path, 'POST', params?.Data).catch(e => {
      console.error(e);
      return e;
    });
  },
  async userVerifyOTP(params) {
    console.log(' === params in userVerifyOTP  ===> ', params);
    return await auth(params.Path, 'POST', params?.Data).catch(e => {
      console.error(e);
      return e;
    });
  },

  async setNewPassword(params) {
    console.log(' === params in setPassword  ===> ', params);
    return await auth(params.Path, 'PUT', params?.Data).catch(e => {
      console.error(e);
      return e;
    });
  },
};
