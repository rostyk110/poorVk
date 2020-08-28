import {
  ADD_SET_USERS,
  DELETE_IN_FOLLOWING_PROGRESS,
  FOLLOW,
  SET_CURRENT_PAGE, SET_IN_FOLLOWING_PROGRESS,
  SET_TOTAL_USERS_COUNT, SET_USERS,
  UNFOLLOW
} from "../types";
import {usersAPI} from "../../api/api";

const followUnfollowFlow = async (dispatch, userId, apiMethod, actionType) => {
  dispatch(setInFollowingProgress(userId))
  const response = await apiMethod(userId)

  if (response.data.resultCode === 0) {
    dispatch({
      type: actionType,
      payload: response.data.data
    })
  }
  dispatch(deleteInFollowingProgress(userId))
}

export const followUser = userId => dispatch => {
  followUnfollowFlow(dispatch, userId, usersAPI.follow.bind(usersAPI), FOLLOW)
}

export const unfollowUser = userId => dispatch => {
  followUnfollowFlow(dispatch, userId, usersAPI.unfollow.bind(usersAPI), UNFOLLOW)
}

export const setCurrentPage = page => {
  return {
    type: SET_CURRENT_PAGE,
    payload: page
  }
}

export const setSearchUsers = (data, isAdd) => {
  return {
    type: !isAdd ? SET_USERS : ADD_SET_USERS,
    payload: data
  }
}


export const setTotalUsersCount = count => {
  return {
    type: SET_TOTAL_USERS_COUNT,
    payload: count
  }
}

export const setInFollowingProgress = id => {
  return {
    type: SET_IN_FOLLOWING_PROGRESS,
    payload: id
  }
}

export const deleteInFollowingProgress = id => {
  return {
    type: DELETE_IN_FOLLOWING_PROGRESS,
    payload: id
  }
}
