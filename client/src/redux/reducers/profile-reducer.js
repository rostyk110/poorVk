import {
  SET_USER_PROFILE,
  SET_PROFILE_STATUS,
  SHOW_ERROR,
  HIDE_ERROR, LOGOUT, SET_IS_EDIT_MODE,
} from "../types";

const initialState = {
  userProfile: null,
  isEditMode: false,
  status: '',
  error: null
}

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload
      }
    case SET_PROFILE_STATUS:
      return {
        ...state,
        status: action.payload
      }
    case SHOW_ERROR:
      return {
        ...state,
        error: action.payload
      }
    case HIDE_ERROR:
      return {
        ...state,
        error: null
      }
    case SET_IS_EDIT_MODE:
      return {
        ...state,
        isEditMode: action.payload
      }
    case LOGOUT:
      return {
        userProfile: null,
        isEditMode: false,
        status: '',
        error: null
      }
    default:
      return state
  }
}

export default profileReducer;
