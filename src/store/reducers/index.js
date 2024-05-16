import AuthReducer from './authReducer';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  auth: AuthReducer,
});

export default rootReducer;
