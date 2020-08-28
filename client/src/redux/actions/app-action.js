import {SET_APP_INITIALIZED, SET_APP_NOT_INITIALIZED} from "../types";
import {getUserData, setOnline} from "./auth-action";
import setAuthToken from "../../utils/setAuthToken";
import {getDialogs} from "./dialogs-action";
import {getChart} from "./music-action";

export const initializeApp = () => dispatch => {
  dispatch({type: SET_APP_NOT_INITIALIZED})
  setAuthToken(localStorage.token)

  if (localStorage.token) {
    const promise1 = dispatch(getUserData())
    const promise2 = dispatch(getDialogs())
    const promise3 = dispatch(setOnline())
    const promise4 = dispatch(getChart())

    Promise.all([promise1, promise2, promise3, promise4])
      .then(() => {
        dispatch({type: SET_APP_INITIALIZED});
      });
  } else {
    dispatch({type: SET_APP_INITIALIZED});
  }
}
