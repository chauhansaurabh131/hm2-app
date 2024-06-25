import * as TYPES from './actionTypes';

// GET ALL MY FRIENDS APIS
export function getAllFriends(payload, callBack) {
  return {type: TYPES.GET_ALL_FRIENDS, data: {payload, callBack}};
}

export const getAllFriendsSuccess = data => ({
  type: TYPES.GET_ALL_FRIENDS_SUCCESS,
  data,
});

export const getAllFriendsFailure = () => ({
  type: TYPES.GET_ALL_FRIENDS_FAILED,
});

// GET ALL DECLINE FRIENDS
export function getAllDeclineFriend(payload, callBack) {
  return {type: TYPES.GET_ALL_DECLINE_FRIENDS, data: {payload, callBack}};
}

export const getAllDeclineFriendsSuccess = data => ({
  type: TYPES.GET_ALL_DECLINE_FRIENDS_SUCCESS,
  data,
});

export const getAllDeclineFriendsFailure = () => ({
  type: TYPES.GET_ALL_DECLINE_FRIENDS_FAILED,
});
