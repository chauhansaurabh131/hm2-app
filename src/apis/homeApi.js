import {post, put, get, upload} from './index';

const getUserAllData = async data => {
  return get('/api/v1/user/user/', data, false);
};

const sendFriendsRequest = async data => {
  return post('/api/v1/user/friend/create-friend', data, true);
};

const getAllFriendRequestData = async data => {
  return get('/api/v1/user/friend/get-frd-requests', data, true);
};

const acceptedDeclineRequested = async data => {
  return post('/api/v1/user/friend/respond-friend-req', data, true);
};

const setUserUpdateDetails = async data => {
  return put('/api/v1/user/auth/update-user', data, true);
};

const updateUserAddress = async data => {
  return post('/api/v1/user/address', data, true);
};

const educationDetail = async data => {
  return post('/api/v1/user/userEducation', data, true);
};

const professionalDetail = async data => {
  return post('/api/v1/user/userProfessionalDetail', data, true);
};

const addProfilePicture = async data => {
  return post('/api/v1/s3/presignedurl', data, true);
};

// const uploadProfilePicture = async presignedUrl => {
//   return post(presignedUrl, data, true);
// };

const partnerReferences = async data => {
  return post('/api/v1/user/partner', data, true);
};

export const home = {
  getUserAllData,
  sendFriendsRequest,
  getAllFriendRequestData,
  acceptedDeclineRequested,
  setUserUpdateDetails,
  updateUserAddress,
  educationDetail,
  professionalDetail,
  addProfilePicture,
  partnerReferences,
};
