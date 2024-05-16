import {call, put, takeEvery, takeLatest} from 'redux-saga/effects';
import {globalUse} from '../../utils/constants';
import {
  GET_REGISTER_REQUEST,
  GET_REGISTER_SUCCESS,
  GET_REGISTER_FAILED,
  GET_LOGIN_REQUEST,
  GET_LOGIN_FAILED,
  GET_LOGIN_SUCCESS,
  OTP_VERIFY_REQUEST,
  OTP_VERIFY_SUCCESS,
  OTP_VERIFY_FAILED,
  SET_PASSWORD_REQUEST,
  SET_PASSWORD_SUCCESS,
  SET_PASSWORD_FAILED,
} from '../type/types';
import {SetLoading} from '../actions/allActions';
import Api from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// worker Saga: will be fired on auth actions
function* getRegisterUserDetails({params}) {
  console.log(' === getRegisterUserDetails_PArams ===> ', params);
  try {
    yield put(SetLoading(true));
    console.log(' === params.data.email ===> ', params.Data.email);
    if (params.Data.email) {
      yield put({
        type: GET_REGISTER_SUCCESS,
        emailPayload: params.Data.email,
      });
    }
    const response = yield call(Api.userRegistration, params);
    if (response.status == 200) {
      yield put({
        type: GET_REGISTER_SUCCESS,
        payload: response.data.data.message,
      });
    } else {
      yield put({type: GET_REGISTER_FAILED, payload: response});
    }
  } catch (e) {
    yield put({type: GET_REGISTER_FAILED, message: e.message});
  } finally {
    yield put(SetLoading(false));
  }
}

function* getLoginUserDetails({params}) {
  try {
    yield put(SetLoading(true));
    const response = yield call(Api.userLogin, params);
    // console.log(' ===getLoginUserDetails...... ===> ', response.data.data);
    console.log(' ===getLoginUserDetails...... ===> ', response);
    if (response.status === 200) {
      yield put({type: GET_LOGIN_SUCCESS, payload: response.data.data});
    } else {
      yield put({type: GET_LOGIN_FAILED, payload: response});
    }
  } catch (e) {
    console.log(' === e.message ===> ', e);
    yield put({type: GET_LOGIN_FAILED, message: e.message});
  } finally {
    yield put(SetLoading(false));
  }
}

function* verifyOTP({params}) {
  try {
    yield put(SetLoading(true));
    const response = yield call(Api.userVerifyOTP, params);
    console.log(' === verifyOTP_response...... ===> ', response.data.data);
    console.log(
      ' ===  response.data.data.tokens?.access?.token,...... ===> ',
      response.data.data.tokens?.access?.token,
    );
    if (response.status == 200) {
      yield put({type: OTP_VERIFY_SUCCESS, payload: [response.data.data]});
    } else {
      yield put({type: OTP_VERIFY_FAILED, payload: response});
    }
  } catch (e) {
    yield put({type: OTP_VERIFY_FAILED, message: e.message});
  } finally {
    yield put(SetLoading(false));
  }
}

function* setPassword({params}) {
  console.log(' === params is now  in saga ===> ', params);
  try {
    yield put(SetLoading(true));
    const response = yield call(Api.setNewPassword, params);
    console.log(
      'response.data.data ======>> inside the setPassword saga ',
      JSON.stringify(response.data.userData, null, 2),
    );
    if (response.status === 200) {
      yield put({type: SET_PASSWORD_SUCCESS, payload: response.data.userData});
    } else {
      yield put({type: SET_PASSWORD_FAILED, payload: response});
    }
  } catch (e) {
    yield put({type: SET_PASSWORD_FAILED, message: e.message});
  } finally {
    yield put(SetLoading(false));
  }
}

export const authSaga = [
  takeEvery(GET_REGISTER_REQUEST, getRegisterUserDetails),
  takeEvery(GET_LOGIN_REQUEST, getLoginUserDetails),
  takeEvery(OTP_VERIFY_REQUEST, verifyOTP),
  takeEvery(SET_PASSWORD_REQUEST, setPassword),
];
