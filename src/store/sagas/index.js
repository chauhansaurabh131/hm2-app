import {all} from 'redux-saga/effects';
import {authSaga} from './authSagas';

export default function* rootSaga() {
  yield all([
    // Add other sagas here
    ...authSaga,
  ]);
}
