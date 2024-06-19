import {post, put, get, upload} from './index';

const getAllFriend = async data => {
  return get('/api/v1/user/friend/get-frds', data, true);
};

export const chat = {
  getAllFriend,
};
