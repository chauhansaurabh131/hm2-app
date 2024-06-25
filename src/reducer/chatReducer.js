import * as TYPES from '../actions/actionTypes';

const initialState = {
  isUserDataLoading: false,
  myAllFriends: [],
  declineFriends: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPES.GET_ALL_FRIENDS:
      return {...state, isUserDataLoading: true};

    case TYPES.GET_ALL_FRIENDS_SUCCESS:
      return {...state, myAllFriends: action.data, isUserDataLoading: false};

    case TYPES.GET_ALL_FRIENDS_FAILED:
      return {...state, isUserDataLoading: false};

    //DECLINE FRIENDS
    case TYPES.GET_ALL_DECLINE_FRIENDS:
      return {...state, isUserDataLoading: true};

    case TYPES.GET_ALL_DECLINE_FRIENDS_SUCCESS:
      return {...state, declineFriends: action.data, isUserDataLoading: false};

    case TYPES.GET_ALL_DECLINE_FRIENDS_FAILED:
      return {...state, isUserDataLoading: false};

    default:
      return state;
  }
};
