import {post, put} from './index';

const register = async data => {
  return post('/api/v1/user/auth/register', data, false);
};

const login = async data => {
  return post('/api/v1/user/auth/login', data, false);
};

const verifyOTP = async data => {
  return post('/api/v1/user/auth/verify-otp-email', data, false);
};

const setPassWord = async data => {
  return put('/api/v1/user/auth/update-user', data, true);
};

export const auth = {
  register,
  login,
  verifyOTP,
  setPassWord,
};
