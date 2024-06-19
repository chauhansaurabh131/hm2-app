import * as TYPES from '../actions/actionTypes';

const initialState = {
  isLoggedIn: false,
  loading: false,
  user: null,
  isUpdatingProfile: false,
};
export default (state = initialState, action) => {
  switch (action.type) {
    case TYPES.REGISTER:
    case TYPES.LOGIN:
    case TYPES.VERIFY_OTP:
    case TYPES.SET_PASSWORD:
    case TYPES.LOGOUT:
      return {...state, loading: true};

    case TYPES.LOGIN_SUCCESS:
    case TYPES.VERIFY_OTP_SUCCESS:
      return {...state, loading: false, user: action?.data};

    case TYPES.REGISTER_SUCCESS:
    case TYPES.SET_PASSWORD_SUCCESS:
    case TYPES.REGISTER_FAILED:
    case TYPES.LOGIN_FAILED:
    case TYPES.VERIFY_OTP_FAILED:
    case TYPES.SET_PASSWORD_FAILED:
      return {...state, loading: false};

    case TYPES.CHANGE_STACK:
      return {...state, isLoggedIn: !state.isLoggedIn};

    //UPDATE USER DETAILS
    case TYPES.SET_UPDATE_USER_DETAILS:
      return {...state, isUpdatingProfile: true};

    case TYPES.SET_UPDATE_USER_DETAILS_SUCCESS:
      return {
        ...state,
        user: {...state.user, user: action.data?.userData},
        isUpdatingProfile: false,
      };
    case TYPES.SET_UPDATE_USER_DETAILS_FAILED:
      return {...state, isUpdatingProfile: false};

    default:
      return state;
  }
};
