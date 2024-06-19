import * as TYPES from '../actions/actionTypes';
import {all, call, put, takeLatest} from 'redux-saga/effects';
import {chat} from '../apis/chatApi';
import * as chatActions from '../actions/chatActions';
import homeSaga from './homeSaga';

function* getAllFriend(action) {
  try {
    const response = yield call(chat.getAllFriend, action.data);
    // console.log(' === SAGA... ===> ', response.data);
    yield put(chatActions.getAllFriendsSuccess(response.data));
  } catch (error) {
    yield put(chatActions.getAllFriendsFailure());
  }
}

function* chatSaga() {
  yield all([takeLatest(TYPES.GET_ALL_FRIENDS, getAllFriend)]);
}

export default chatSaga;
