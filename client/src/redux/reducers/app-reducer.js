import {SET_APP_INITIALIZED, SET_APP_NOT_INITIALIZED} from "../types";

const initialState = {
  initialized: false
}

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_APP_INITIALIZED:
      return {
        ...state,
        initialized: true
      }
    case SET_APP_NOT_INITIALIZED:
      return {
        ...state,
        initialized: false
      }
    default:
      return state
  }
}

export default appReducer
