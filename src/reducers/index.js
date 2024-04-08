import {setAsyncStorageData} from '../utils/global';
import {TOKEN} from '../utils/constants';
import loginReducer from './store/loginReducer';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  // auth: authReducer,
  // home: homeReducer,
  // explore: exploreReducer,
  // sortFilter: sortFilter,
  // register: registerReducer,
  login: loginReducer,
  // sell: sellReducer,
  // wishList: wishListReducer,
  // profile: profileReducer,
  // productDetails: productDetailsReducer,
  // soleWallet: soleWalletReducer,
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
