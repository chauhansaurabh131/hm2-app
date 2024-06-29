import {post, put, get, upload} from './index';

const getAllFriend = async data => {
  return get('/api/v1/user/friend/get-frd-mobile', data, true);
};

const getAllDeclineFriends = async data => {
  return get('/api/v1/user/friend/get-rejected-frds', data, true);
};

export const chat = {
  getAllFriend,
  getAllDeclineFriends,
};
