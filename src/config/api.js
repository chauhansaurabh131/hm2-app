import {AsyncStorage} from 'react-native';

import axios from 'axios/index';
import Toast from 'react-native-toast-message';

import {BASE_URL} from '../utils/constants';
import {TOKEN} from '../utils/constants';
import {getAsyncStorageData} from '../utils/global';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const url = path => {
  return BASE_URL + path;
};

const getHeaders = async auth => {
  let headers = {...defaultHeaders};
  if (auth) {
    const token = await getAuthToken();
    headers = {...headers, authorization: token};
  }
  return headers;
};

export const apiService = axios.create({});

export const get = async (path, params = {}, auth = true) => {
  const headers = await getHeaders(auth);
  return apiService.get(url(path, params), {
    params,
    headers: headers,
  });
};

export const post = async (path, params = {}, auth = true) => {
  const headers = await getHeaders(auth);
  return apiService.post(url(path, params), params, {
    headers: headers,
  });
};

export const put = async (path, params = {}, auth = true) => {
  const headers = await getHeaders(auth);
  return apiService.put(url(path, params), params, {
    headers: headers,
  });
};

export const deleteRequest = async (path, params = {}, auth = true) => {
  const headers = await getHeaders(auth);
  return apiService.delete(url(path, params), {params, headers: headers});
};

export const upload = (path, params = {}, auth = true) =>
  apiService.post(url(path, params), params, {
    headers: {...getHeaders(auth), 'content-type': 'multipart/form-data'},
  });

export const download = (path, params = {}, auth = true) =>
  apiService.get(url(path, params), {
    responseType: 'blob',
    params,
    headers: getHeaders(auth),
  });

const getUrl = config => {
  if (config?.baseURL) {
    return config.url.replace(config.baseURL, '');
  }
  return config?.url;
};

apiService.interceptors.request.use(
  config => {
    return config;
  },
  error => Promise.reject(error),
);

apiService.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error && error.response && error.response.data.code === 404) {
      return Promise.reject(error);
    }
    if (error.response && error.response.data && error.response.data.message) {
      console.log(error.response.data.message);
      Toast.show({
        type: 'error',
        text1: error.response.data.message,
      });
    }
    if (error && error.response && error.response.data.code === 401) {
      // store.dispatch(logout());
      AsyncStorage.clear().then(() => {
        // navigate('EnterOTP');
      });
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export const getAuthToken = async () => {
  const data = await getAsyncStorageData(TOKEN);
  if (data) {
    return `${data}`;
  }
  return null;
};

export const getRefreshToken = async () => {
  const data = await getAsyncStorageData(TOKEN);
  if (data) {
    return data?.refresh?.token ? `${data?.refresh?.token}` : '';
  }
  return null;
};
