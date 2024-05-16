import {
  GET_LOGIN_REQUEST,
  GET_REGISTER_REQUEST,
  OTP_VERIFY_REQUEST,
  SET_LOADING,
  SET_PASSWORD_REQUEST,
} from '../type/types';

// ## Login Action ##
export const SetLoading = payload => {
  return {
    type: SET_LOADING,
    payload,
  };
};

// ## Login Action ##
export const Login = params => {
  console.log('params====> in login', params);
  return {
    type: GET_LOGIN_REQUEST,
    params,
  };
};

// ## Registration Action ##
export const Registration = params => {
  console.log(' === params ===> ', params);
  return {
    type: GET_REGISTER_REQUEST,
    params,
  };
};

export const VerifyOtp = params => {
  console.log(' === VerifyOtp ===> ', params);
  return {
    type: OTP_VERIFY_REQUEST,
    params,
  };
};

export const SetPassword = params => {
  console.log(' === SetPassword ===> ', params);
  return {
    type: SET_PASSWORD_REQUEST,
    params,
  };
};
