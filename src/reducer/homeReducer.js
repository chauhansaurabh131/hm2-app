import * as TYPES from '../actions/actionTypes';
import {
  GET_ALL_ACCEPTED_DATING,
  GET_ALL_ACCEPTED_FAILED_DATING,
  GET_ALL_ACCEPTED_SUCCESS_DATING,
} from '../actions/actionTypes';

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
  paymentDetail: [],
  isGetPaymentDetailsLoading: false,
  isDataCountingLoader: false,
  isDataStoriesLoader: false,
  // userLike: [],
  addShortListData: [],
  storiesData: [],
  // removeShortListData: [],
  dataCount: [],
  isLikeLoader: false,
  isDisLikeLoader: false,
  shortListData: [],
  sendRequestData: [],
  getAllRequest: [],
  getAllAccepted: [],
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

    // return {
    //   ...state,
    //   user: {...state.user, user: action.data?.userData},
    //   isUpdatingProfile: false,
    // };

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
    // case TYPES.EDUCATION_DETAILS:
    //   return {...state, isSendRequestLoading: true};
    //
    // case TYPES.ADD_EDUCATION_DETAILS_SUCCESS:
    //   return {
    //     ...state,
    //     educationsDetails: action.data,
    //     isSendRequestLoading: false,
    //   };
    // case TYPES.ADD_EDUCATION_DETAILS_FAILED:
    //   return {...state, isSendRequestLoading: false};

    //GET ALL PAYMENT DETAILS
    case TYPES.GET_ALL_PAYMENT_DETAILS:
      return {...state, isGetPaymentDetailsLoading: true};

    case TYPES.GET_ALL_PAYMENT_DETAILS_SUCCESS:
      return {
        ...state,
        paymentDetail: action.data,
        isGetPaymentDetailsLoading: false,
      };
    case TYPES.GET_ALL_PAYMENT_DETAILS_FAILED:
      return {...state, isGetPaymentDetailsLoading: false};

    // ADD SHORT LIST
    case TYPES.ADD_SHORT_LIST:
      return {...state, isGetPaymentDetailsLoading: true};

    case TYPES.ADD_SHORT_LIST_SUCCESS:
      return {
        ...state,
        addShortListData: action.data,
        isGetPaymentDetailsLoading: false,
      };
    case TYPES.ADD_SHORT_LIST_FAILED:
      return {...state, isGetPaymentDetailsLoading: false};

    // GET DATA COUNTING LIST
    case TYPES.DATA_COUNTING_LIST:
      return {...state, isDataCountingLoader: true};

    case TYPES.DATA_COUNTING_LIST_SUCCESS:
      return {
        ...state,
        dataCount: action.data,
        isDataCountingLoader: false,
      };
    case TYPES.DATA_COUNTING_LIST_FAILED:
      return {...state, isDataCountingLoader: false};

    // GET SUCCESS STORIES DATA
    case TYPES.GET_SUCCESS_STORIES:
      return {...state, isDataStoriesLoader: true};

    case TYPES.GET_SUCCESS_STORIES_SUCCESS:
      return {
        ...state,
        storiesData: action.data,
        isDataStoriesLoader: false,
      };
    case TYPES.GET_SUCCESS_STORIES_FAILED:
      return {...state, isDataStoriesLoader: false};

    // GET SHORTLIST  DATA
    case TYPES.GET_ALL_SHORTLIST:
      return {...state, isDataStoriesLoader: true};

    case TYPES.GET_ALL_SHORTLIST_SUCCESS:
      return {
        ...state,
        shortListData: action.data,
        isDataStoriesLoader: false,
      };
    case TYPES.GET_ALL_SHORTLIST_FAILED:
      return {...state, isDataStoriesLoader: false};

    //GET ALL SEND REQUESTED
    case TYPES.GET_ALL_REQUEST_SEND:
      return {...state, isDataStoriesLoader: true};

    case TYPES.GET_ALL_REQUEST_SEND_SUCCESS:
      return {
        ...state,
        sendRequestData: action.data,
        isDataStoriesLoader: false,
      };
    case TYPES.GET_ALL_REQUEST_SEND_FAILED:
      return {...state, isDataStoriesLoader: false};

    // USER LIKE
    case TYPES.USER_LIKE:
      return {...state, isLikeLoader: true};

    case TYPES.USER_LIKE_SUCCESS:
      return {
        ...state,
        userLike: action.data,
        isLikeLoader: false,
      };
    case TYPES.USER_LIKE_FAILED:
      return {...state, isLikeLoader: false};

    // USER DIS_LIKE
    case TYPES.USER_DIS_LIKE:
      return {...state, isDisLikeLoader: true};

    case TYPES.USER_DIS_SUCCESS:
      return {
        ...state,
        userLike: action.data,
        isDisLikeLoader: false,
      };
    case TYPES.USER_DIS_FAILED:
      return {...state, isDisLikeLoader: false};

    // // REMOVE SHORT LIST
    //
    // case TYPES.REMOVE_SHORT_LIST:
    //   return {...state, isGetPaymentDetailsLoading: true};
    //
    // case TYPES.REMOVE_SHORT_LIST_SUCCESS:
    //   return {
    //     ...state,
    //     removeShortListData: action.data,
    //     isGetPaymentDetailsLoading: false,
    //   };
    // case TYPES.REMOVE_SHORT_LIST_FAILED:
    //   return {...state, isGetPaymentDetailsLoading: false};

    // GET ALL REQUESTED DATING
    case TYPES.GET_ALL_REQUESTED_DATING:
      return {...state, isSendRequestLoading: true};

    case TYPES.GET_ALL_REQUESTED_SUCCESS_DATING:
      return {
        ...state,
        getAllRequest: action.data,
        isSendRequestLoading: false,
      };
    case TYPES.GET_ALL_REQUESTED_FAILED_DATING:
      return {...state, isSendRequestLoading: false};

    //GET ALL REQUESTED ACCEPTED DATING
    case TYPES.GET_ALL_ACCEPTED_DATING:
      return {...state, isSendRequestLoading: true};

    case TYPES.GET_ALL_ACCEPTED_SUCCESS_DATING:
      return {
        ...state,
        getAllAccepted: action.data,
        isSendRequestLoading: false,
      };
    case TYPES.GET_ALL_ACCEPTED_FAILED_DATING:
      return {...state, isSendRequestLoading: false};

    default:
      return state;
  }
};
