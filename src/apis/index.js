// import {AsyncStorage} from 'react-native';

import axios from 'axios/index';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'react-native-blob-util';

import { BASE_URL, REFRESH_TOKEN } from '../utils/constants';
import { TOKEN } from '../utils/constants';
import { getAsyncStorageData } from '../utils/global';
import { store } from '../reducer/store/index';
import { logout } from '../actions/authActions';
import { navigationRef } from '../navigations';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const url = path => {
  return BASE_URL + path;
};

const getHeaders = async auth => {
  let headers = { ...defaultHeaders };
  if (auth) {
    const token = await getAuthToken();
    // console.log(' === var ===> ', token);
    headers = { ...headers, authorization: token };
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
  return apiService.delete(url(path, params), { params, headers: headers });
};

export const upload = async (path, params = {}, auth = true, fileUri) => {
  console.log(' === fileUri ===> ', fileUri);
  try {
    const response = await axios.put(url(path, params), {
      data: RNFetchBlob.wrap(fileUri),
    });

    console.log('File uploaded successfully');
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

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

const handleResponseError = error => {
  if (error && error.response && error.response.data.code === 404) {
    return Promise.reject(error);
  }
  if (error.response && error.response.data && error.response.data.message) {
    console.log('.....error', error.response.data.message);

    // Toast.show({
    //   type: 'error',
    //   text1: error.response.data.message,
    // });
  }
  if (
    error &&
    error.response &&
    (error.response.data.code === 401 ||
      error.response.data.message === 'Please authenticate' ||
      error.response.data.message === 'Token Expired')
  ) {
    const state = store.getState().auth;
    // Only dispatch logout if not already processing one (loading) and currently logged in
    if (!state.loading && state.isLoggedIn) {
      store.dispatch(logout());
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: 'NewLogInScreen', params: { sessionExpired: true } }],
      });
    }
    return Promise.reject(error);
  }
  console.log(' === error ===> ', error);
  return Promise.reject(error);
};

apiService.interceptors.response.use(function (response) {
  return response;
}, handleResponseError);

// Apply the same interceptor to the default axios instance
axios.interceptors.response.use(function (response) {
  return response;
}, handleResponseError);

export const getAuthToken = async () => {
  // First try Redux state for immediate availability after login
  const state = store.getState();
  const reduxToken = state?.auth?.user?.tokens?.access?.token;
  if (reduxToken) {
    return `Bearer ${reduxToken}`;
  }

  // Fallback to AsyncStorage
  const data = await getAsyncStorageData(TOKEN);
  if (data) {
    return `${data}`;
  }
  return null;
};

export const getRefreshToken = async () => {
  // First try Redux state
  const state = store.getState();
  const reduxRefreshToken = state?.auth?.user?.tokens?.refresh?.token;
  if (reduxRefreshToken) {
    return `${reduxRefreshToken}`;
  }

  // Fallback to AsyncStorage
  const data = await getAsyncStorageData(REFRESH_TOKEN);
  if (data) {
    // Check if it's an object (old way) or string (new way)
    if (typeof data === 'string') {
      return data.startsWith('Bearer ') ? data.replace('Bearer ', '') : data;
    }
    return data?.refresh?.token ? `${data?.refresh?.token}` : '';
  }
  return null;
};
