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
export function accepted_Decline_Request(payload) {
  return {type: TYPES.ACCEPTED_DECLINE_FRIEND_REQUEST, data: {payload}};
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
