import {post} from './index';

const getLogin = async data => {
  return post('/admin-panel/api/login', data, false);
};

export const loginApi = {
  getLogin,
};
