import {
  SET_USER_PROFILE,
  SET_PROFILE_STATUS,
  UPLOAD_PHOTO,
  SHOW_ERROR,
  HIDE_ERROR, SET_IS_EDIT_MODE
} from "../types";
import {profileAPI} from "../../api/api";
import {stopSubmit} from "redux-form";
import {hideLoader, showLoader} from "./loader-action";

export const setUserProfile = userId => async dispatch => {
  dispatch(showLoader())
  const response = await profileAPI.getProfile(userId)

  dispatch({
    type: SET_USER_PROFILE,
    payload: response.data
  })
  dispatch(hideLoader())
}

export const getUserStatus = userId => async dispatch => {
  const response = await profileAPI.getStatus(userId)

  dispatch({
    type: SET_PROFILE_STATUS,
    payload: response.data
  })
}

export const updateUserStatus = status => async dispatch => {
  const response = await profileAPI.setStatus(status)

  if (response.data.resultCode === 0) {
    dispatch({
      type: SET_PROFILE_STATUS,
      payload: status
    })
  }
}

export const uploadPhoto = photo => async dispatch => {
  const response = await profileAPI.uploadPhoto(photo)

  if (response.data.resultCode === 0) {
    dispatch({
      type: UPLOAD_PHOTO,
      payload: response.data.data.avatar
    })
  } else {
    dispatch({
      type: SHOW_ERROR,
      payload: response.data.messages[0]
    })
    setTimeout(() => {
      dispatch({type: HIDE_ERROR})
    }, 4000)
  }
}

export const updateUserProfile = profile => async (dispatch, getState) => {
  const response = await profileAPI.updateProfile(profile)
  const userId = getState().auth.userId

  if (response.data.resultCode === 0) {
    dispatch(setUserProfile(userId))
  } else {
    dispatch(stopSubmit("profile-description", {_error: response.data.messages[0]}))
    return Promise.reject(response.data.messages[0])
  }
}


export const setIsEditMode = value => {
  return {
    type: SET_IS_EDIT_MODE,
    payload: value
  }
}

