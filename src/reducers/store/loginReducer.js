import * as TYPES from '../actions/types';

const initialState = {
  isLoggedIn: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPES.GET_LOGIN_DATA:
      return {...state, isLoginLoading: true};
    case TYPES.GET_LOGIN_DATA_SUCCESS:
      return {
        ...state,
        user: action.data,
        isLoggedIn: true,
        isLoginLoading: false,
      };

    case TYPES.GET_LOGIN_DATA_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        isLoginLoading: false,
      };
    default:
      return state;
  }
};
