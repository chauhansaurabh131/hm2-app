import {all, call, put, takeLatest} from 'redux-saga/effects';

import * as TYPES from '../actions/actionTypes';

import * as authAction from '../actions/authActions';
import {auth} from '../apis/authApi';
import {setAsyncStorageData} from '../utils/global';
import {REFRESH_TOKEN, TOKEN} from '../utils/constants';
import navigations from '../navigations';
import {SET_2FA_AUTO} from '../actions/actionTypes';
import {authOtpVerifyFail, authOtpVerifySuccess} from '../actions/authActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

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

// function* login(action) {
//   try {
//     const response = yield call(auth.login, action.data.payload);
//
//     yield put(authAction.loginSuccess(response.data?.data));
//
//     yield setAsyncStorageData(
//       TOKEN,
//       `Bearer ${response?.data?.data?.tokens?.access?.token}`,
//     );
//
//     yield setAsyncStorageData(
//       REFRESH_TOKEN,
//       `Bearer ${response?.data?.data?.tokens?.refresh?.token}`,
//     );
//
//     action.data?.successCallback();
//   } catch (error) {
//     const statusCode = error?.response?.status;
//     const errorMessage = error?.response?.data?.message || 'An error occurred.';
//     const otpType = error?.response?.data?.otpType;
//     const otpEmail = error?.response?.data?.email;
//     const otpMobileNumber = error?.response?.data?.mobileNumber;
//
//     console.log('=== error status ===>', statusCode);
//     console.log('=== error message ===>', errorMessage);
//
//     // 👇 Handle specific error scenarios
//     if (errorMessage === 'Incorrect email or password') {
//       console.log('❌ Wrong email or password');
//       // Optionally show toast
//       Toast.show({
//         type: 'error',
//         text1: 'Invalid Credentials',
//         text2: 'Incorrect email or password',
//       });
//     } else if (statusCode === 502) {
//       console.log('❗ Server is temporarily unavailable (502 error)');
//       // Optionally show toast or alert
//       Toast.show({
//         type: 'error',
//         text1: 'Server Error',
//         text2: 'Service temporarily unavailable. Please try again later.',
//       });
//     } else {
//       // ✅ For OTP or other handled errors
//       action.data?.failureCallback(otpType, otpEmail, otpMobileNumber);
//     }
//
//     yield put(authAction.loginFail());
//   }
// }

function* login(action) {
  try {
    const response = yield call(auth.login, action.data.payload);

    console.log(
      ' === response----*** ===> ',
      response?.data?.data?.user?.appUsesType,
    );

    const appUsesType = response?.data?.data?.user?.appUsesType;

    const userProfileCompleted =
      response?.data?.data?.user?.userProfileCompleted;

    const userPartnerPreCompleted =
      response?.data?.data?.user?.userPartnerPreCompleted;

    yield put(authAction.loginSuccess(response.data?.data));

    yield setAsyncStorageData(
      TOKEN,
      `Bearer ${response?.data?.data?.tokens?.access?.token}`,
    );

    yield setAsyncStorageData(
      REFRESH_TOKEN,
      `Bearer ${response?.data?.data?.tokens?.refresh?.token}`,
    );

    // 🔹 Call success callback to proceed in app
    // action.data?.successCallback();
    action.data?.successCallback(
      appUsesType,
      userProfileCompleted,
      userPartnerPreCompleted,
    );
  } catch (error) {
    const statusCode = error?.response?.status;
    const errorMessage = error?.response?.data?.message || 'An error occurred.';
    const otpType = error?.response?.data?.otpType;
    const otpEmail = error?.response?.data?.email;
    const otpMobileNumber = error?.response?.data?.mobileNumber;

    console.log('=== error status ===>', statusCode);
    console.log('=== error message ===>', errorMessage);

    if (errorMessage === 'Incorrect email or password') {
      Toast.show({
        type: 'error',
        text1: 'Invalid Credentials',
        text2: 'Incorrect email or password',
      });
    } else if (statusCode === 502) {
      Toast.show({
        type: 'error',
        text1: 'Server Error',
        text2: 'Service temporarily unavailable. Please try again later.',
      });
    } else if (errorMessage === 'Your account has been deleted.') {
      // ❌ Don't navigate, just show toast or alert
      Toast.show({
        type: 'error',
        text1: 'Account Deleted',
        text2: 'This account has been deleted. Please contact support.',
      });
    } else {
      // ✅ All other errors like OTP verification
      action.data?.failureCallback(otpType, otpEmail, otpMobileNumber);
    }

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

function* googleLogin(action) {
  try {
    const response = yield call(auth.googleLoggin, action.data.payload);

    const appUsesType = response?.data?.data?.user?.appUsesType;

    // Save tokens
    yield setAsyncStorageData(
      TOKEN,
      `Bearer ${response?.data?.data?.tokens?.access?.token}`,
    );

    yield setAsyncStorageData(
      REFRESH_TOKEN,
      `Bearer ${response?.data?.data?.tokens?.refresh?.token}`,
    );

    // Put success even if appUsesType is missing so we have user info in Redux
    yield put(authAction.googleLoginSuccess(response.data.data));

    if (appUsesType) {
      // Success callback (already in home stack or finished setup)
      action.data?.successCallback?.();
    } else {
      // Failure callback (need to select app type / setup profile)
      action.data?.failureCallback?.();
    }
  } catch (error) {
    const statusCode = error?.response?.status;
    const errorMessage = error?.response?.data?.message || 'An error occurred.';
    const otpType = error?.response?.data?.otpType;
    const otpEmail = error?.response?.data?.email;
    const otpMobileNumber = error?.response?.data?.mobileNumber;

    console.log('=== google login error status ===>', statusCode);
    console.log('=== google login error message ===>', errorMessage);

    // ❌ SAME CONDITIONS AS NORMAL LOGIN
    if (errorMessage === 'Incorrect email or password') {
      Toast.show({
        type: 'error',
        text1: 'Invalid Credentials',
        text2: 'Incorrect email or password',
      });
    } else if (statusCode === 502) {
      Toast.show({
        type: 'error',
        text1: 'Server Error',
        text2: 'Service temporarily unavailable. Please try again later.',
      });
    } else if (errorMessage === 'Your account has been deleted.') {
      Toast.show({
        type: 'error',
        text1: 'Account Deleted',
        text2: 'This account has been deleted. Please contact support.',
      });
    } else {
      // ✅ OTP / verification flow
      action.data?.failureCallback?.(otpType, otpEmail, otpMobileNumber);
    }

    yield put(authAction.googleLoginFail());
  }
}

// function* googleLogin(action) {
//   try {
//     const response = yield call(auth.googleLoggin, action.data.payload);
//
//     // Check if appUsesType exists in the response
//     const appUsesType = response.data.data?.user?.appUsesType;
//
//     console.log(' === googleLoginSuccess+++++ ===> ', appUsesType);
//
//     yield setAsyncStorageData(
//       TOKEN,
//       `Bearer ${response?.data?.data?.tokens?.access?.token}`,
//     );
//
//     if (appUsesType) {
//       // If appUsesType exists, trigger success and the success callback
//       yield put(authAction.googleLoginSuccess(response.data.data));
//       yield setAsyncStorageData(
//         TOKEN,
//         `Bearer ${response?.data?.data?.tokens?.access?.token}`,
//       );
//       yield setAsyncStorageData(
//         REFRESH_TOKEN,
//         `Bearer ${response?.data?.data?.tokens?.refresh?.token}`,
//       );
//
//       // Trigger success callback if provided
//       if (action.data.callback) {
//         console.log(' === Success Callback ===> ', appUsesType);
//         action.data.callback();
//       }
//       console.log('Done');
//     } else {
//       // If appUsesType does not exist, trigger failure
//       yield put(authAction.googleLoginFail());
//
//       // Trigger failure callback if provided
//       if (action.data.failedCallback) {
//         console.log(' === Failure Callback ===> appUsesType is undefined');
//         action.data.failedCallback();
//       }
//       console.log('Failed');
//     }
//   } catch (error) {
//     // Handle any errors during login
//     yield put(authAction.googleLoginFail());
//     console.log('Error during login: ', error);
//
//     if (action.data.failedCallback) {
//       action.data.failedCallback();
//     }
//     console.log('Failed');
//   }
// }

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

function* logout() {
  try {
    yield call(AsyncStorage.clear);
    yield put({type: TYPES.LOGOUT_SUCCESS});
  } catch (error) {
    console.log('Logout Error: ', error);
    yield put({type: TYPES.LOGOUT_SUCCESS}); // Force logout even if clear fails
  }
}

// Root auth saga
function* authSaga() {
  yield all([
    takeLatest(TYPES.REGISTER, register),
    takeLatest(TYPES.LOGIN, login),
    takeLatest(TYPES.GOOGLE_LOGIN, googleLogin),
    takeLatest(TYPES.VERIFY_OTP, verifyOTP),
    takeLatest(TYPES.SET_PASSWORD, setPassword),
    takeLatest(TYPES.LOGOUT_START, logout),
    // takeLatest(TYPES.GET_USER_DATA, getUserData),
  ]);
}

export default authSaga;
