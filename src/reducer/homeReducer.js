import * as TYPES from '../actions/actionTypes';

const initialState = {
  isUserDataLoading: false,
  userData: [],
  isSendRequestLoading: false,
  sendRequest: [],
  getAllRequestData: [],
  isFriendRequestDataLoading: false,
  acceptedDeclineFriendData: [],
  UserAddress: [],
  educationsDetails: [],
  professionalDetails: [],
  addProfilePicture: [],
  addPartnerReferences: [],
};
export default (state = initialState, action) => {
  // console.log(' === Reducer_action.data ===> ', action.data);
  switch (action.type) {
    //GET ALL USER DATA
    case TYPES.GET_USER_DATA:
      return {...state, isUserDataLoading: true};

    case TYPES.GET_USER_DATA_SUCCESS:
      return {
        ...state,
        userData: action.data,
        isUserDataLoading: false,
      };

    case TYPES.GET_USER_DATA_FAILED:
      return {...state, isUserDataLoading: false};

    // SEND FRIEND REQUEST
    case TYPES.SEND_REQUEST:
      return {...state, isSendRequestLoading: true};

    case TYPES.SEND_REQUEST_SUCCESS:
      console.log(' === Reducer ===> ', action.data);
      return {
        ...state,
        sendRequest: action.data,
        isSendRequestLoading: false,
      };

    case TYPES.SEND_REQUEST_FAILED:
      return {...state, isSendRequestLoading: false};

    //GET ALL FRIENDS REQUEST
    case TYPES.GET_ALL_REQUEST:
      return {...state, isFriendRequestDataLoading: true};

    case TYPES.GET_ALL_REQUEST_SUCCESS:
      return {
        ...state,
        getAllRequestData: action.data,
        isFriendRequestDataLoading: false,
      };

    case TYPES.GET_ALL_REQUEST_FAILED:
      return {...state, isFriendRequestDataLoading: false};

    // ACCEPTED DECLINE FRIEND REQUEST //
    case TYPES.ACCEPTED_DECLINE_FRIEND_REQUEST:
      return {...state, isSendRequestLoading: true};

    case TYPES.ACCEPTED_DECLINE_FRIEND_REQUEST_SUCCESS:
      return {
        ...state,
        acceptedDeclineFriendData: action.data,
        isSendRequestLoading: false,
      };
    case TYPES.ACCEPTED_DECLINE_FRIEND_REQUEST_FAILED:
      return {...state, isSendRequestLoading: false};

    // UPDATE USER ADDRESS
    // case TYPES.SET_USER_ADDRESS:
    //   return {...state, isSendRequestLoading: true};
    //
    // case TYPES.SET_USER_ADDRESS_SUCCESS:
    //   return {
    //     ...state,
    //     UserAddress: action.data,
    //     isSendRequestLoading: false,
    //   };
    // case TYPES.SET_USER_ADDRESS_FAILED:
    //   return {...state, isSendRequestLoading: false};

    //UPDATE EDUCATIONS DETAILS
    case TYPES.EDUCATION_DETAILS:
      return {...state, isSendRequestLoading: true};

    case TYPES.ADD_EDUCATION_DETAILS_SUCCESS:
      return {
        ...state,
        educationsDetails: action.data,
        isSendRequestLoading: false,
      };
    case TYPES.ADD_EDUCATION_DETAILS_FAILED:
      return {...state, isSendRequestLoading: false};

    // //PROFESSIONAL DETAILS APIS
    // case TYPES.PROFESSIONAL_DETAILS:
    //   return {...state, isSendRequestLoading: true};
    //
    // case TYPES.ADD_PROFESSIONAL_DETAILS_SUCCESS:
    //   return {
    //     ...state,
    //     professionalDetails: action.data,
    //     isSendRequestLoading: false,
    //   };
    // case TYPES.ADD_PROFESSIONAL_DETAILS_FAILED:
    //   return {...state, isSendRequestLoading: false};

    // //ADD PROFILE PICTURE APIS
    // case TYPES.ADD_PROFILE_PICTURE:
    //   return {...state, isSendRequestLoading: true};
    //
    // case TYPES.ADD_PROFILE_PICTURE_SUCCESS:
    //   return {
    //     ...state,
    //     addProfilePicture: action.data,
    //     isSendRequestLoading: false,
    //   };
    // case TYPES.ADD_PROFILE_PICTURE_FAILED:
    //   return {...state, isSendRequestLoading: false};

    // //ADD PARTNER REFERENCES
    // case TYPES.PARTNER_PREFERENCES_DETAILS:
    //   return {...state, isSendRequestLoading: true};
    //
    // case TYPES.PARTNER_PREFERENCES_DETAILS_SUCCESS:
    //   return {
    //     ...state,
    //     addPartnerReferences: action.data,
    //     isSendRequestLoading: false,
    //   };
    // case TYPES.PARTNER_PREFERENCES_DETAILS_FAILED:
    //   return {...state, isSendRequestLoading: false};

    default:
      return state;
  }
};
