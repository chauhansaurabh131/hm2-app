// import * as apiService from './index';
// import {BASE_URL, TOKEN} from '../utils/constants';
// import {getAsyncStorageData} from '../utils/global';
//
// const defaultHeaders = {
//   'Content-Type': 'application/json',
// };
//
// const url = (path, params) => {
//   return BASE_URL + path;
// };
//
// export const getAuthToken = async () => {
//   const data = await getAsyncStorageData(TOKEN);
//   if (data) {
//     return `${data}`;
//   }
//   return null;
// };
//
// const getHeaders = async auth => {
//   let headers = {...defaultHeaders};
//   if (auth) {
//     const token = await getAuthToken();
//     headers = {...headers, authorization: token};
//   }
//   return headers;
// };
//
// export const post = async (path, params = {}, auth = true) => {
//   const headers = await getHeaders(auth);
//   return apiService.post(url(path, params), params, {
//     headers: headers,
//   });
// };
