import * as TYPES from '../actions/actionTypes';
import {SET_LOADING} from '../store/type/types';

const initialState = {
  isLoggedIn: false,
  loading: false,
  user: null,
  isUpdatingProfile: false,
  isAddressLoading: false,
  isEducationLoading: false,
  appUsesType: '',
  // getAllRequest: [],
};
export default (state = initialState, action) => {
  switch (action.type) {
    case TYPES.REGISTER:
    case TYPES.LOGIN:
    case TYPES.GOOGLE_LOGIN:
    case TYPES.VERIFY_OTP:
    case TYPES.SET_PASSWORD:
    case TYPES.LOGOUT:
      return {...state, loading: true};

    case TYPES.LOGIN_SUCCESS:

    case TYPES.GOOGLE_SUCCESS:
      return {...state, loading: false, user: action?.data};

    case TYPES.VERIFY_OTP_SUCCESS:
      return {...state, loading: false, user: action?.data};

    case TYPES.REGISTER_SUCCESS:
    case TYPES.SET_PASSWORD_SUCCESS:
    case TYPES.REGISTER_FAILED:
    case TYPES.LOGIN_FAILED:
      return {...state, loading: false};

    case TYPES.GOOGLE_FAILED:

    case TYPES.VERIFY_OTP_FAILED:
    case TYPES.SET_PASSWORD_FAILED:
      return {...state, loading: false};

    case TYPES.CHANGE_STACK:
      // console.log(' === var ===> ', action.data);
      return {
        ...state,
        isLoggedIn: !state.isLoggedIn,
        appUsesType: action.data,
      };

    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

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

    case TYPES.EDUCATION_DETAILS:
      return {...state, isEducationLoading: true};

    case TYPES.ADD_EDUCATION_DETAILS_SUCCESS:
      console.log(
        ' === ADD_EDUCATION_DETAILS_SUCCESS ===> ',
        JSON.stringify(action.data?.data, null, 2),
      );

      return {
        ...state,
        user: {
          ...state.user,
          user: {...state.user.user, userEducation: action.data.data},
        },
        isEducationLoading: false,
      };

    // return {
    //   ...state,
    //   user: {
    //     ...state.user,
    //     user: {...state.user.user, education: action.data.data},
    //   },
    //   isEducationLoading: false,
    // };
    case TYPES.ADD_EDUCATION_DETAILS_FAILED:
      return {...state, isEducationLoading: false};

    // //PROFESSIONAL DETAILS APIS
    case TYPES.PROFESSIONAL_DETAILS:
      return {...state, isSendRequestLoading: true};

    case TYPES.ADD_PROFESSIONAL_DETAILS_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          user: {...state.user.user, userProfessional: action.data.data},
        },
        isSendRequestLoading: false,
      };
    case TYPES.ADD_PROFESSIONAL_DETAILS_FAILED:
      return {...state, isSendRequestLoading: false};

    //ADD PROFILE PICTURE APIS
    case TYPES.ADD_PROFILE_PICTURE:
      return {...state, isSendRequestLoading: true};

    case TYPES.ADD_PROFILE_PICTURE_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          user: action.data?.data?.data?.userData,
        },
      };
    case TYPES.ADD_PROFILE_PICTURE_FAILED:
      return {...state, isSendRequestLoading: false};

    //DELETE PICTURE
    case TYPES.DELETE_IMAGE:
      return {...state, isSendRequestLoading: true};

    case TYPES.DELETE_IMAGE_SUCCESS:
      console.log(
        ' === SET_USER_ADDRESS_SUCCESS ===> ',
        JSON.stringify(action.data.data?.userProfilePic, null, 2),
      );

      return {
        ...state,
        user: {
          ...state.user,
          user: {
            ...state.user.user,
            userProfilePic: action.data.data?.userProfilePic,
          },
        },
        isSendRequestLoading: false,
      };

    case TYPES.DELETE_IMAGE_FAILED:
      return {...state, isSendRequestLoading: false};

    //ADD PARTNER REFERENCES
    case TYPES.PARTNER_PREFERENCES_DETAILS:
      return {...state, isSendRequestLoading: true};

    case TYPES.PARTNER_PREFERENCES_DETAILS_SUCCESS:
      console.log(
        ' === PARTNER_PREFERENCES_DETAILS_SUCCESS ===> ',
        JSON.stringify(
          {
            ...state.user.user,
            userPartner: action.data.data,
          },
          null,
          2,
        ),
      );

      return {
        ...state,
        user: {
          ...state.user,
          user: {...state.user.user, userPartner: action.data.data},
        },
        isUpdatingProfile: false,
      };
    case TYPES.PARTNER_PREFERENCES_DETAILS_FAILED:
      return {...state, isSendRequestLoading: false};

    //ADD DATING PARTNER REFERENCES
    case TYPES.DATING_PARTNER_PREFERENCES_DETAILS:
      return {...state, isSendRequestLoading: true};

    case TYPES.DATING_PARTNER_PREFERENCES_DETAILS_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          user: {...state.user.user, userDatingPartner: action.data.data},
        },
        isUpdatingProfile: false,
      };
    case TYPES.DATING_PARTNER_PREFERENCES_DETAILS_FAILED:
      return {...state, isSendRequestLoading: false};

    // GET ALL REQUESTED DATING
    // case TYPES.GET_ALL_REQUESTED_DATING:
    //   return {...state, isSendRequestLoading: true};
    //
    // case TYPES.GET_ALL_REQUESTED_SUCCESS_DATING:
    //   return {
    //     ...state,
    //     getAllRequest: action.data,
    //     isSendRequestLoading: false,
    //   };
    // case TYPES.GET_ALL_REQUESTED_FAILED_DATING:
    //   return {...state, isSendRequestLoading: false};

    default:
      return state;
  }
};
