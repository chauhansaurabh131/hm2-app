import {post, put, get, upload} from './index';

const getUserAllData = async data => {
  // return get('/api/v1/user/user/', data, false);
  return get('/api/v1/user/user/getUserByGender', data, true);
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

const paymentDetail = async data => {
  return get('/api/v1/admin/plan/get-plan', data, true);
};

const addShortListsData = async data => {
  return post('/api/v1/user/shortlist/create-shortlist', data, true);
};

const addDataCountingData = async data => {
  return get('/api/v1/user/user/getStatusCount', data, true);
};

const getSuccessStories = async data => {
  return get('/api/v1/user/story/get-story', data, false);
};

const getAllShortListData = async data => {
  return get('/api/v1/user/shortlist/get-short-list', data, true);
};

const getAllSendRequested = async data => {
  return get('/api/v1/user/friend/get-request-sent', data, true);
};

const deletePicture = async ({userId, profileImageUrl, name}) => {
  return post(
    `/api/v1/user/user/delete-profile-image/${userId}`,
    {profileImageUrl, name},
    true,
  );
};

const isLikeDetails = async data => {
  return post('/api/v1/user/like/create-like', data, true);
};

const isDisLikeDetails = async data => {
  return post(`api/v1/user/like/update-like/${data}`, {}, true);
};

const datingPartnerReferencesApi = async data => {
  return put('/api/v1/user/dating-partner/', data, true);
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
  paymentDetail,
  addShortListsData,
  addDataCountingData,
  getSuccessStories,
  getAllShortListData,
  getAllSendRequested,
  deletePicture,
  isLikeDetails,
  isDisLikeDetails,
  datingPartnerReferencesApi,
  // removeAddShortList,
  // userLikes,
  // user_Dis_Like,
};
