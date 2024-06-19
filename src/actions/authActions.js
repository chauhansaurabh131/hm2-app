import {SET_LOADING} from './actionTypes';
import * as TYPES from './actionTypes';

/* ------------- REGISTER ------------- */
export const register = (payload, callback) => ({
  type: TYPES.REGISTER,
  data: {payload, callback},
});

export const registerSuccess = () => ({
  type: TYPES.REGISTER_SUCCESS,
});

export const registerFail = () => ({
  type: TYPES.REGISTER_FAILED,
});

/* ------------- LOGIN ------------- */
export const login = (payload, callback) => ({
  type: TYPES.LOGIN,
  data: {payload, callback},
});

export const loginSuccess = data => ({
  type: TYPES.LOGIN_SUCCESS,
  data,
});

export const loginFail = () => ({
  type: TYPES.LOGIN_FAILED,
});

// Verify OTP Actions
export const verifyOTP = (payload, callback) => ({
  type: TYPES.VERIFY_OTP,
  data: {payload, callback},
});

export const verifyOTPSuccess = data => ({
  type: TYPES.VERIFY_OTP_SUCCESS,
  data,
});

export const verifyOTPFail = () => ({type: TYPES.VERIFY_OTP_FAILED});

// Set Password Actions
export const setPassword = (payload, callback) => ({
  type: TYPES.SET_PASSWORD,
  data: {payload, callback},
});
export const setPasswordSuccess = () => ({type: TYPES.SET_PASSWORD_SUCCESS});
export const setPasswordFail = () => ({type: TYPES.SET_PASSWORD_FAILED});

export function logout(clear) {
  return {type: TYPES.LOGOUT_START, clear};
}

export const changeStack = () => ({type: TYPES.CHANGE_STACK});

export const SetLoading = payload => {
  return {type: SET_LOADING, payload};
};
