import {all, call, put, takeLatest, takeEvery} from 'redux-saga/effects';
import {home} from '../apis/homeApi';
import * as homeActions from '../actions/homeActions';
import * as TYPES from '../actions/actionTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {REFRESH_TOKEN, TOKEN} from '../utils/constants';

function* getUserData(action) {
  try {
    const response = yield call(home.getUserAllData, action.data);
    // console.log(' === SAGA... ===> ', response.data);
    yield put(homeActions.userDataSuccess(response.data));
  } catch (error) {
    yield put(homeActions.userDataFail());
  }
}

// user?.tokens?.access?.token

function* sendFriendRequest(action) {
  try {
    const accessToken = yield call(AsyncStorage.getItem, TOKEN);

    const cleanedToken = accessToken.replace(/^"|"$/g, '');

    const payloadWithToken = {
      ...action.data.payload,
      accessToken: cleanedToken,
    };

    console.log(' === action.data.payload ===> ', action.data.payload);

    const response = yield call(home.sendFriendsRequest, action.data.payload);
    yield put(homeActions.sendRequestSuccess(response.data?.data));
  } catch (error) {
    yield put(homeActions.sendRequestFail());
  }
}

function* getFriendRequest(action) {
  const accessToken = yield call(AsyncStorage.getItem, TOKEN);
  // console.log(' === accessToken ===> ', accessToken);
  try {
    const response = yield call(home.getAllFriendRequestData, action.data);
    yield put(homeActions.getAllRequestDataSuccess(response.data));
  } catch (error) {
    yield put(homeActions.getAllRequestDataFail());
  }
}

function* acceptedDeclineFriendRequest(action) {
  try {
    const accessToken = yield call(AsyncStorage.getItem, TOKEN);
    const cleanedToken = accessToken.replace(/^"|"$/g, '');
    const payloadWithToken = {
      ...action.data.payload,
      accessToken: cleanedToken,
    };
    console.log(' === action.data.payload ===> ', action.data.payload);

    const response = yield call(
      home.acceptedDeclineRequested,
      action.data.payload,
    );
    yield put(
      homeActions.acceptedDeclineFriendRequestSuccess(response.data?.data),
    );

    console.log(' === SAGA...2222222 ===> ', response.data?.data);
  } catch (error) {
    yield put(homeActions.acceptedDeclineFriendRequestFailure());
  }
}

function* setUpdateDetails(action) {
  const accessToken = yield call(AsyncStorage.getItem, TOKEN);
  // console.log(' === accessToken ===> ', accessToken);
  try {
    const response = yield call(home.setUserUpdateDetails, action.data.payload);
    yield put(homeActions.setUpdateDetailsSuccess(response.data));
    if (action.data.callBack) {
      action.data.callBack();
    }
  } catch (error) {
    yield put(homeActions.setUpdateDetailsFailure());
  }
}

function* updateAddress(action) {
  const accessToken = yield call(AsyncStorage.getItem, TOKEN);
  // console.log(' === accessToken ===> ', accessToken);
  try {
    const response = yield call(home.updateUserAddress, action.data.payload);
    yield put(homeActions.addressDetailsSuccess(response.data));
    if (action.data.callBack) {
      action.data.callBack();
    }
  } catch (error) {
    yield put(homeActions.addressDetailsFailure());
  }
}

function* educationDetails(action) {
  const accessToken = yield call(AsyncStorage.getItem, TOKEN);
  // console.log(' === accessToken ===> ', accessToken);
  try {
    const response = yield call(home.educationDetail, action.data.payload);
    yield put(homeActions.addEducationsSuccess(response.data));
    if (action.data.callBack) {
      action.data.callBack();
    }
  } catch (error) {
    yield put(homeActions.addEducationsFailure());
  }
}

function* professionalDetail(action) {
  const accessToken = yield call(AsyncStorage.getItem, TOKEN);
  // console.log(' === accessToken ===> ', accessToken);
  try {
    const response = yield call(home.professionalDetail, action.data.payload);
    yield put(homeActions.addProfessionalDetailSuccess(response.data));
    if (action.data.callBack) {
      action.data.callBack();
    }
  } catch (error) {
    yield put(homeActions.addProfessionalDetailFailure());
  }
}

function* addProfilePicture(action) {
  try {
    const response = yield call(home.addProfilePicture, action.data.payload);
    yield put(homeActions.addProfilePictureSuccess(response.data));
    if (action.data.callBack) {
      action.data.callBack(response);
    }
  } catch (error) {
    yield put(homeActions.addProfilePictureFailure());
  }
}

function* partnerReferences(action) {
  const accessToken = yield call(AsyncStorage.getItem, TOKEN);
  // console.log(' === accessToken ===> ', accessToken);
  try {
    const response = yield call(home.partnerReferences, action.data.payload);
    yield put(homeActions.partnerReferencesSuccess(response.data));
    if (action.data.callBack) {
      action.data.callBack();
    }
  } catch (error) {
    yield put(homeActions.partnerReferencesFailure());
  }
}

// function* getPaymentDetail(action) {
//   const accessToken = yield call(AsyncStorage.getItem, TOKEN);
//   console.log(' === var ===> ', action);
//   try {
//     const response = yield call(home.paymentDetail, action.data);
//     yield put(homeActions.paymentDetailsSuccess(response.data));
//
//     if (action.data.callBack) {
//       action.data.callBack();
//     }
//   } catch (error) {
//     yield put(homeActions.paymentDetailsFailure());
//   }
// }

function* getPaymentDetail(action) {
  try {
    const response = yield call(home.paymentDetail, action.data);
    yield put(homeActions.paymentDetailsSuccess(response.data));
  } catch (error) {
    yield put(homeActions.paymentDetailsFailure());
  }
}

function* addShortLists(action) {
  try {
    const response = yield call(home.addShortListsData, action.data);
    yield put(homeActions.addShortListSuccess(response.data));
  } catch (error) {
    yield put(homeActions.addShortListFailure());
  }
}

// function* removeShortLists(action) {
//   try {
//     const response = yield call(home.addShortListsData, action.data);
//     yield put(homeActions.removeShortListSuccess(response.data));
//   } catch (error) {
//     yield put(homeActions.removeShortListFailure());
//   }
// }

// function* userLikes(action) {
//   try {
//     const response = yield call(home.userLikes, action.data);
//     yield put(homeActions.userLikeSuccess(response.data));
//   } catch (error) {
//     yield put(homeActions.userLikeFailure());
//   }
// }
//
// function* user_Dis_Likes(action) {
//   try {
//     const response = yield call(home.userLikes, action.data);
//     yield put(homeActions.userLikeSuccess(response.data));
//   } catch (error) {
//     yield put(homeActions.userLikeFailure());
//   }
// }

function* homeSaga() {
  yield all([takeLatest(TYPES.GET_USER_DATA, getUserData)]);
  yield all([takeLatest(TYPES.SEND_REQUEST, sendFriendRequest)]);
  yield all([takeLatest(TYPES.GET_ALL_REQUEST, getFriendRequest)]);
  yield all([
    takeLatest(
      TYPES.ACCEPTED_DECLINE_FRIEND_REQUEST,
      acceptedDeclineFriendRequest,
    ),
  ]);
  yield all([takeLatest(TYPES.SET_UPDATE_USER_DETAILS, setUpdateDetails)]);
  yield all([takeLatest(TYPES.SET_USER_ADDRESS, updateAddress)]);
  yield all([takeLatest(TYPES.EDUCATION_DETAILS, educationDetails)]);
  yield all([takeLatest(TYPES.PROFESSIONAL_DETAILS, professionalDetail)]);
  yield all([takeEvery(TYPES.ADD_PROFILE_PICTURE, addProfilePicture)]);
  yield all([takeLatest(TYPES.PARTNER_PREFERENCES_DETAILS, partnerReferences)]);
  yield all([takeLatest(TYPES.GET_ALL_PAYMENT_DETAILS, getPaymentDetail)]);
  yield all([takeLatest(TYPES.ADD_SHORT_LIST, addShortLists)]);
  // yield all([takeLatest(TYPES.REMOVE_SHORT_LIST, removeShortLists)]);
  // yield all([takeLatest(TYPES.USER_LIKE, userLikes)]);
  // yield all([takeLatest(TYPES.USER_DIS_LIKE, user_Dis_Likes)]);
}

export default homeSaga;
