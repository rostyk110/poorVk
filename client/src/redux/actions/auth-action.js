import {
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_SUCCESS,
  SET_SOCKET,
  SET_USER_DATA,
  SET_USER_IS_OFFLINE,
  SET_USER_IS_ONLINE
} from "../types";
import {authAPI, usersAPI} from "../../api/api";
import {stopSubmit} from "redux-form";

export const login = authData => async dispatch => {
  const response = await authAPI.login(authData)

  if (response.data.resultCode === 0) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: response.data.data
    });

    dispatch(getUserData())
  } else {
    let error = response.data.messages.length ? response.data.messages[0] : 'Something went wrong...'
    dispatch(stopSubmit("login", {_error: error}))
  }
}

export const register = authData => async dispatch => {
  const response = await usersAPI.register(authData)

  if (response.data.resultCode === 0) {
    dispatch({
      type: REGISTER_SUCCESS,
      payload: response.data.data
    });

    dispatch(getUserData())
  } else {
    let error = response.data.messages.length ? response.data.messages[0] : 'Something went wrong...'
    dispatch(stopSubmit("register", {_error: error}))
  }
}

export const getUserData = () => async dispatch => {
  try {
    const response = await authAPI.me()

    if (response.data.resultCode === 0) {
      const {_id, email, avatar, following, fullName} = response.data.data

      dispatch({
        type: SET_USER_DATA,
        payload: {userId: _id, fullName, email, following, avatar, isAuth: true}
      })
    }
  } catch (e) {
    console.log(e)
  }
}

export const setOnline = () => async dispatch => {
  try {
    const response = await usersAPI.setOnline()

    if (response.data.resultCode === 0) {
      dispatch({
        type: SET_USER_IS_ONLINE
      })
    }
  } catch (e) {
    console.log(e)
  }
}
export const setOffline = () => async dispatch => {
  try {
    const response = await usersAPI.setOffline()

    if (response.data.resultCode === 0) {
      dispatch({
        type: SET_USER_IS_OFFLINE
      })
    }
  } catch (e) {
    console.log(e)
  }
}

export const logout = () => dispatch => {
  dispatch(setOffline())
  dispatch({type: LOGOUT})
}

export const setSocket = socket => {
  return {
    type: SET_SOCKET,
    payload: socket
  }
}


