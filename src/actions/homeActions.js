import * as TYPES from './actionTypes';

// GET ALL USER
export function userDatas(data) {
  return {type: TYPES.GET_USER_DATA, data};
}

export function userDataSuccess(data) {
  return {type: TYPES.GET_USER_DATA_SUCCESS, data};
}

export function userDataFail() {
  return {type: TYPES.GET_USER_DATA_FAILED};
}

// SEND FRIEND REQUEST
export function sendRequest(payload) {
  return {type: TYPES.SEND_REQUEST, data: {payload}};
}

export const sendRequestSuccess = data => ({
  type: TYPES.SEND_REQUEST_SUCCESS,
  data,
});

export const sendRequestFail = () => ({type: TYPES.SEND_REQUEST_FAILED});

// GET ALL USER REQUEST
export function getAllRequest(data) {
  return {type: TYPES.GET_ALL_REQUEST, data};
}

export function getAllRequestDataSuccess(data) {
  return {type: TYPES.GET_ALL_REQUEST_SUCCESS, data};
}

export function getAllRequestDataFail() {
  return {type: TYPES.GET_ALL_REQUEST_FAILED};
}

// ACCEPTED_DECLINE_FRIEND_REQUEST //
export function accepted_Decline_Request(payload, callBack) {
  return {
    type: TYPES.ACCEPTED_DECLINE_FRIEND_REQUEST,
    data: {payload, callBack},
  };
}

export const acceptedDeclineFriendRequestSuccess = data => ({
  type: TYPES.ACCEPTED_DECLINE_FRIEND_REQUEST_SUCCESS,
  data,
});

export const acceptedDeclineFriendRequestFailure = () => ({
  type: TYPES.ACCEPTED_DECLINE_FRIEND_REQUEST_FAILED,
});

//UPDATE USER DETAILS
export function updateDetails(payload, callBack) {
  return {type: TYPES.SET_UPDATE_USER_DETAILS, data: {payload, callBack}};
}

export const setUpdateDetailsSuccess = data => ({
  type: TYPES.SET_UPDATE_USER_DETAILS_SUCCESS,
  data,
});

export const setUpdateDetailsFailure = () => ({
  type: TYPES.SET_UPDATE_USER_DETAILS_FAILED,
});

// UPDATE USER ADDRESS
export function addressDetails(payload, callBack) {
  return {type: TYPES.SET_USER_ADDRESS, data: {payload, callBack}};
}

export const addressDetailsSuccess = data => ({
  type: TYPES.SET_USER_ADDRESS_SUCCESS,
  data,
});

export const addressDetailsFailure = () => ({
  type: TYPES.SET_USER_ADDRESS_FAILED,
});

//UPDATE EDUCATION DETAILS
export function educationDetails(payload, callBack) {
  return {type: TYPES.EDUCATION_DETAILS, data: {payload, callBack}};
}

export const addEducationsSuccess = data => ({
  type: TYPES.ADD_EDUCATION_DETAILS_SUCCESS,
  data,
});

export const addEducationsFailure = () => ({
  type: TYPES.ADD_EDUCATION_DETAILS_FAILED,
});

//PROFESSIONAL DETAILS
export function professionalDetail(payload, callBack) {
  return {type: TYPES.PROFESSIONAL_DETAILS, data: {payload, callBack}};
}

export const addProfessionalDetailSuccess = data => ({
  type: TYPES.ADD_PROFESSIONAL_DETAILS_SUCCESS,
  data,
});

export const addProfessionalDetailFailure = () => ({
  type: TYPES.ADD_PROFESSIONAL_DETAILS_FAILED,
});

// ADD PROFILE PICTURE
export function addProfilePicture(payload, callBack) {
  return {type: TYPES.ADD_PROFILE_PICTURE, data: {payload, callBack}};
}

export const addProfilePictureSuccess = data => ({
  type: TYPES.ADD_PROFILE_PICTURE_SUCCESS,
  data,
});

export const addProfilePictureFailure = () => ({
  type: TYPES.ADD_PROFILE_PICTURE_FAILED,
});

//ADD PARTNER REFERENCES
export function partnerReferences(payload, callBack) {
  return {type: TYPES.PARTNER_PREFERENCES_DETAILS, data: {payload, callBack}};
}

export const partnerReferencesSuccess = data => ({
  type: TYPES.PARTNER_PREFERENCES_DETAILS_SUCCESS,
  data,
});

export const partnerReferencesFailure = () => ({
  type: TYPES.PARTNER_PREFERENCES_DETAILS_FAILED,
});

//GET ALL PAYMENT DETAILS
export function paymentDetails(data) {
  console.log(' === data ===> ', data);
  return {type: TYPES.GET_ALL_PAYMENT_DETAILS, data};
}

export function paymentDetailsSuccess(data) {
  return {type: TYPES.GET_ALL_PAYMENT_DETAILS_SUCCESS, data};
}

export const paymentDetailsFailure = () => ({
  type: TYPES.GET_ALL_PAYMENT_DETAILS_FAILED,
});

// ADD SHORT LIST
export function addShortList(data) {
  console.log(' === addShortList.... ===> ', data);
  return {type: TYPES.ADD_SHORT_LIST, data};
}

export function addShortListSuccess(data) {
  return {type: TYPES.ADD_SHORT_LIST_SUCCESS, data};
}

export const addShortListFailure = () => ({
  type: TYPES.ADD_SHORT_LIST_FAILED,
});

// USER LIKE
export function userLike(data) {
  return {type: TYPES.USER_LIKE, data};
}

export function userLikeSuccess(data) {
  return {type: TYPES.USER_LIKE_SUCCESS, data};
}

export const userLikeFailure = () => ({
  type: TYPES.USER_LIKE_FAILED,
});

// USER DIS_LIKE
export function userDis_Like(data) {
  return {type: TYPES.USER_DIS_LIKE, data};
}

export function userDis_LikeSuccess(data) {
  return {type: TYPES.USER_DIS_SUCCESS, data};
}

export const userDis_LikeFailure = () => ({
  type: TYPES.USER_DIS_FAILED,
});

// // REMOVE SHORT LIST DATA
// export function removeShortList(data) {
//   console.log(' === addShortList.... ===> ', data);
//   return {type: TYPES.REMOVE_SHORT_LIST, data};
// }
//
// export function removeShortListSuccess(data) {
//   return {type: TYPES.REMOVE_SHORT_LIST_SUCCESS, data};
// }
//
// export const removeShortListFailure = () => ({
//   type: TYPES.REMOVE_SHORT_LIST_FAILED,
// });

// ALL SHORTLIST DATA
export function getAllShortlist(payload, callBack) {
  return {
    type: TYPES.GET_ALL_SHORTLIST,
    data: {payload, callBack},
  };
}

export const getAllShortlistSuccess = data => ({
  type: TYPES.GET_ALL_SHORTLIST_SUCCESS,
  data,
});

export const getAllShortlistFailure = () => ({
  type: TYPES.GET_ALL_SHORTLIST_FAILED,
});

// GET ALL REQUEST SEND DATA
export function getAllSendRequest(payload, callBack) {
  return {
    type: TYPES.GET_ALL_REQUEST_SEND,
    data: {payload, callBack},
  };
}

export const getAllSendRequestSuccess = data => ({
  type: TYPES.GET_ALL_REQUEST_SEND_SUCCESS,
  data,
});

export const getAllSendRequestFailure = () => ({
  type: TYPES.GET_ALL_REQUEST_SEND_FAILED,
});

export function dataCountingList(payload, callBack) {
  return {
    type: TYPES.DATA_COUNTING_LIST,
    data: {payload, callBack},
  };
}

export const dataCountingListSuccess = data => ({
  type: TYPES.DATA_COUNTING_LIST_SUCCESS,
  data,
});

export const dataCountingListFailure = () => ({
  type: TYPES.DATA_COUNTING_LIST_FAILED,
});

//GET SUCCESS STORIES LIST
export function getSuccessStories(payload, callBack) {
  return {
    type: TYPES.GET_SUCCESS_STORIES,
    data: {payload, callBack},
  };
}

export const getSuccessStoriesSuccess = data => ({
  type: TYPES.GET_SUCCESS_STORIES_SUCCESS,
  data,
});

export const getSuccessStoriesFAILED = () => ({
  type: TYPES.GET_SUCCESS_STORIES_FAILED,
});

// DELETE IMAGE

export function deleteImage(payload, callBack) {
  return {
    type: TYPES.DELETE_IMAGE,
    data: {payload, callBack},
  };
}

export const deleteImageSuccess = data => ({
  type: TYPES.DELETE_IMAGE_SUCCESS,
  data,
});

export const deleteImageFAILED = () => ({
  type: TYPES.DELETE_IMAGE_FAILED,
});

//ADD DATING PARTNER REFERENCES
export function datingPartnerReferences(payload, callBack) {
  return {
    type: TYPES.DATING_PARTNER_PREFERENCES_DETAILS,
    data: {payload, callBack},
  };
}

export const datingPartnerReferencesSuccess = data => ({
  type: TYPES.DATING_PARTNER_PREFERENCES_DETAILS_SUCCESS,
  data,
});

export const datingPartnerReferencesFailure = () => ({
  type: TYPES.DATING_PARTNER_PREFERENCES_DETAILS_FAILED,
});
