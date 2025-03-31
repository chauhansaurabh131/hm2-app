import {all, call, put, takeLatest} from 'redux-saga/effects';

import * as TYPES from '../actions/actionTypes';

import * as authAction from '../actions/authActions';
import {auth} from '../apis/authApi';
import {setAsyncStorageData} from '../utils/global';
import {REFRESH_TOKEN, TOKEN} from '../utils/constants';
import navigations from '../navigations';
import {SET_2FA_AUTO} from '../actions/actionTypes';
import {authOtpVerifyFail, authOtpVerifySuccess} from '../actions/authActions';
import {AsyncStorage} from 'react-native';

// Register saga
function* register(action) {
  try {
    const response = yield call(auth.register, action.data.payload);
    yield put(authAction.registerSuccess(response.data));
    if (action.data.callback) {
      action.data.callback();
    }
  } catch (error) {
    yield put(authAction.registerFail());
  }
}

// Login saga
function* login(action) {
  try {
    const response = yield call(auth.login, action.data.payload);
    yield put(authAction.loginSuccess(response.data?.data));

    yield setAsyncStorageData(
      TOKEN,
      `Bearer ${response?.data?.data?.tokens?.access?.token}`,
    );

    yield setAsyncStorageData(
      REFRESH_TOKEN,
      `Bearer ${response?.data?.data?.tokens?.refresh?.token}`,
    );

    action.data?.successCallback();
  } catch (error) {
    // console.log(' === error____ ===> ', error);
    const errorMessage = error?.response?.data?.message || 'An error occurred.';
    const otpType = error?.response?.data?.otpType;
    const otpEmail = error?.response?.data?.email;
    const otpMobileNumber = error?.response?.data?.mobileNumber;

    console.log(' === error?.response ===> ', error?.response?.data?.method);

    if (errorMessage !== 'Incorrect email or password') {
      // action.data?.failureCallback();
      action.data?.failureCallback(otpType, otpEmail, otpMobileNumber);
    }
    // action.data?.failureCallback();

    yield put(authAction.loginFail());
  }
}

// Verify OTP saga
function* verifyOTP(action) {
  try {
    const response = yield call(auth.verifyOTP, action.data.payload);
    yield put(authAction.verifyOTPSuccess(response.data.data));

    yield setAsyncStorageData(
      TOKEN,
      `Bearer ${response?.data?.data?.tokens?.access?.token}`,
    );

    yield setAsyncStorageData(
      REFRESH_TOKEN,
      `Bearer ${response?.data?.data?.tokens?.refresh?.token}`,
    );

    if (action.data.callback) {
      action.data.callback();
    }
  } catch (error) {
    yield put(authAction.verifyOTPFail());
  }
}

// Set Password saga
function* setPassword(action) {
  try {
    const response = yield call(auth.setPassWord, action.data.payload);
    yield put(authAction.setPasswordSuccess(response.data));
    if (action.data.callback) {
      action.data.callback();
    }
  } catch (error) {
    yield put(authAction.setPasswordFail());
  }
}

// Root auth saga
function* authSaga() {
  yield all([
    takeLatest(TYPES.REGISTER, register),
    takeLatest(TYPES.LOGIN, login),
    takeLatest(TYPES.VERIFY_OTP, verifyOTP),
    takeLatest(TYPES.SET_PASSWORD, setPassword),
    // takeLatest(TYPES.GET_USER_DATA, getUserData),
  ]);
}

export default authSaga;
