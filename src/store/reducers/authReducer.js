import {
  GET_REGISTER_SUCCESS,
  GET_REGISTER_FAILED,
  GET_LOGIN_SUCCESS,
  GET_LOGIN_FAILED,
  SET_LOADING,
  OTP_VERIFY_SUCCESS,
  OTP_VERIFY_FAILED,
  SET_PASSWORD_SUCCESS,
  SET_PASSWORD_FAILED,
} from '../type/types';

const initialState = {
  loading: false,
  userDetails: [],
  userDetailsError: null,
  RegisterMessage: null,
  RegisterMessageFailed: null,
  userError: null,
  otpVerifiedDetails: [],
  updatedEmail: null,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING: {
      return {
        ...state,
        loading: action.payload,
        RegisterMessage: null,
        RegisterMessageFailed: null,
        userDetailsError: null,
      };
    }
    case GET_REGISTER_SUCCESS: {
      if (action.emailPayload) {
        return {
          ...state,
          updatedEmail: action.emailPayload,
        };
      }
      return {
        ...state,
        RegisterMessage: action.payload,
      };
    }
    case GET_REGISTER_FAILED: {
      return {
        ...state,
        RegisterMessageFailed: action.payload,
      };
    }
    case GET_LOGIN_SUCCESS: {
      return {
        ...state,
        userDetails: action.payload,
      };
    }
    case GET_LOGIN_FAILED: {
      return {
        ...state,
        userDetailsError: action.payload,
      };
    }
    case OTP_VERIFY_SUCCESS: {
      return {
        ...state,
        otpVerifiedDetails: action.payload,
      };
    }
    case OTP_VERIFY_FAILED: {
      return {
        ...state,
        otpVerifiedDetails: [],
      };
    }
    case SET_PASSWORD_SUCCESS: {
      return {
        ...state,
        userDetails: action.payload,
      };
    }
    case SET_PASSWORD_FAILED: {
      return {
        ...state,
        userDetailsError: action.payload,
      };
    }
    default:
      return state;
  }
};

export default AuthReducer;
