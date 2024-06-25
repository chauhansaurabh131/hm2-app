import * as TYPES from '../actions/actionTypes';

const initialState = {
  isLoggedIn: false,
  loading: false,
  user: null,
  isUpdatingProfile: false,
  isAddressLoading: false,
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

    case TYPES.SET_USER_ADDRESS:
      return {...state, isAddressLoading: true};

    case TYPES.SET_USER_ADDRESS_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          user: {...state.user.user, address: action.data.data},
        },
        isAddressLoading: false,
      };
    case TYPES.SET_USER_ADDRESS_FAILED:
      return {...state, isAddressLoading: false};

    // //PROFESSIONAL DETAILS APIS
    case TYPES.PROFESSIONAL_DETAILS:
      return {...state, isSendRequestLoading: true};

    case TYPES.ADD_PROFESSIONAL_DETAILS_SUCCESS:
      // console.log(
      //   ' === SET_USER_ADDRESS_SUCCESS ===> ',
      //   JSON.stringify(
      //     {
      //       ...state.user.user,
      //       userProfessional: action.data.data,
      //     },
      //     null,
      //     2,
      //   ),
      // );
      return {
        ...state,
        user: {
          ...state.user,
          user: {...state.user.user, userProfessional: action.data.data},
        },
        isAddressLoading: false,
      };
    case TYPES.ADD_PROFESSIONAL_DETAILS_FAILED:
      return {...state, isSendRequestLoading: false};

    //ADD PROFILE PICTURE APIS
    case TYPES.ADD_PROFILE_PICTURE:
      return {...state, isSendRequestLoading: true};

    case TYPES.ADD_PROFILE_PICTURE_SUCCESS:
      console.log(
        ' === SET_USER_ADDRESS_SUCCESS ===> ',
        JSON.stringify(action.data?.data?.data?.userData, null, 2),
      );
      return {
        ...state,
        user: {
          ...state.user,
          user: action.data?.data?.data?.userData,
          // ...action.data?.userData,
        },
      };
    case TYPES.ADD_PROFILE_PICTURE_FAILED:
      return {...state, isSendRequestLoading: false};

    //ADD PARTNER REFERENCES
    case TYPES.PARTNER_PREFERENCES_DETAILS:
      return {...state, isSendRequestLoading: true};

    case TYPES.PARTNER_PREFERENCES_DETAILS_SUCCESS:
      return {
        ...state,
        user: {...state.user.user, userPartner: action.data?.data},
        isUpdatingProfile: false,
      };
    case TYPES.PARTNER_PREFERENCES_DETAILS_FAILED:
      return {...state, isSendRequestLoading: false};

    default:
      return state;
  }
};
