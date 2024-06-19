import {all, fork} from 'redux-saga/effects';

import authSaga from './authSaga';
import homeSaga from './homeSaga';
import chatSaga from './chatSaga';

export default function* root() {
  yield all([fork(authSaga)]);
  yield all([fork(homeSaga)]);
  yield all([fork(chatSaga)]);
}
