import {combineReducers} from 'redux';

// Reducers
import authReducer from './authReducer';
import {TOKEN} from '../utils/constants';
import {setAsyncStorageData} from '../utils/global';
import homeReducer from './homeReducer';
import chatReducer from './chatReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  home: homeReducer,
  chat: chatReducer,
});

export default (state, action) => {
  if (action.type === 'RESET_APP_STATE') {
    state = undefined;
  }
  if (action?.type === 'LOGOUT_START') {
    setAsyncStorageData(TOKEN, '');
    state = {
      auth: {
        isRootStack: true,
        isFirstTime: false,
        isSecondTime: false,
        isThirdTime: false,
        isFourthTime: false,
        isDropsCallFirstTime: true,
      },
    };
  }
  return rootReducer(state, action);
};
