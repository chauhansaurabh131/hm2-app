import {all, call, put, takeLatest} from 'redux-saga/effects';
import * as loginAction from '../actions/loginAction';
import {setAsyncStorageData} from '../utils/global';
import {loginApi} from '../api/loginApi';
import * as TYPES from '../actions/types';
import {TOKEN} from '../utils/constants';

function* getLogin(action) {
  try {
    const response = yield call(loginApi.getLogin, action.data.data);
    if (action?.callBack?.appleLoginCallBack) {
      action?.callBack?.appleLoginCallBack();
    }
    if (!response.data.error) {
      yield put(loginAction.loginSuccess(response.data));
      yield setAsyncStorageData(
        TOKEN,
        `Bearer ${response?.data?.access_token}`,
      );
      if (action.data.callback) {
        action.data.callback();
      }
    } else {
      yield put(loginAction.loginFailure());
    }
  } catch (error) {
    yield put(loginAction.loginFailure());
  }
}

function* login() {
  yield all([takeLatest(TYPES.GET_LOGIN_DATA, getLogin)]);
}
export default login;
