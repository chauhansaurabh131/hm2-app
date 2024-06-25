import * as TYPES from '../actions/actionTypes';
import {all, call, put, takeLatest} from 'redux-saga/effects';
import {chat} from '../apis/chatApi';
import * as chatActions from '../actions/chatActions';
import homeSaga from './homeSaga';
import {
  getAllDeclineFriendsFailure,
  getAllDeclineFriendsSuccess,
} from '../actions/chatActions';

function* getAllFriend(action) {
  try {
    const response = yield call(chat.getAllFriend, action.data);
    // console.log(' === SAGA... ===> ', response.data);
    yield put(chatActions.getAllFriendsSuccess(response.data));
  } catch (error) {
    yield put(chatActions.getAllFriendsFailure());
  }
}

function* getAllDeclineFriends(action) {
  try {
    const response = yield call(chat.getAllDeclineFriends, action.data);
    // console.log(' === SAGA... ===> ', response.data);
    yield put(chatActions.getAllDeclineFriendsSuccess(response.data));
  } catch (error) {
    yield put(chatActions.getAllDeclineFriendsFailure());
  }
}

function* chatSaga() {
  yield all([takeLatest(TYPES.GET_ALL_FRIENDS, getAllFriend)]);
  yield all([takeLatest(TYPES.GET_ALL_DECLINE_FRIENDS, getAllDeclineFriends)]);
}

export default chatSaga;
