import * as TYPES from '../actions/actionTypes';

const initialState = {
  isUserDataLoading: false,
  myAllFriends: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPES.GET_ALL_FRIENDS:
      return {...state, isUserDataLoading: true};

    case TYPES.GET_ALL_FRIENDS_SUCCESS:
      return {...state, myAllFriends: action.data, isUserDataLoading: true};

    case TYPES.GET_ALL_FRIENDS_FAILED:
      return {...state, isUserDataLoading: false};

    default:
      return state;
  }
};
