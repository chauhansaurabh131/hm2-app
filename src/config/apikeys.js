const BASE_URL = 'https://happymilan.tech/api/';
const register = BASE_URL + 'v1/user/auth/';
const login = BASE_URL + 'v1/user/auth/';
const verifyOTP = BASE_URL + 'v1/user/auth/';
const setPassword = BASE_URL + 'v1/user/auth/';

export const apiKeys = {
  Path: 'Path',
  Data: 'Data',
  // Auths
  register: register + 'register',
  login: login + 'login',
  verifyOTP: verifyOTP + 'verify-otp-email',
  setPassword: setPassword + 'update-user',
};
