import * as TYPES from './types';

export function login(data, callBack) {
  return {type: TYPES.GET_LOGIN_DATA, data, callBack};
}

export function loginSuccess(data) {
  return {type: TYPES.GET_LOGIN_DATA_SUCCESS, data};
}

export function loginFailure() {
  return {type: TYPES.GET_LOGIN_DATA_FAILURE};
}
