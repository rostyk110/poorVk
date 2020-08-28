import {
  FOLLOW,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_SUCCESS,
  SET_SOCKET,
  SET_USER_DATA,
  SET_USER_IS_OFFLINE, UNFOLLOW,
  UPLOAD_PHOTO
} from "../types";

const initialState = {
  userId: null,
  email: null,
  fullName: null,
  avatar: null,
  following: null,
  isAuth: false,
  socket: null,
  token: localStorage.getItem('token')
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        token: action.payload
      }
    case SET_USER_DATA:
      return {
        ...state,
        ...action.payload
      }
    case UPLOAD_PHOTO:
      return {
        ...state,
        avatar: action.payload
      }
    case SET_SOCKET:
      return {
        ...state,
        socket: action.payload
      }
    case FOLLOW:
      return {
        ...state,
        following: [...state.following, action.payload]
      }
    case UNFOLLOW:
      return {
        ...state,
        following: state.following.filter(f => f._id !== action.payload._id)
  }
    case LOGOUT:
    case SET_USER_IS_OFFLINE:
      return {
        userId: null,
        email: null,
        fullName: null,
        avatar: null,
        token: null,
        socket: null,
        isAuth: false
      }
    default:
      return state
  }
}

export default authReducer
