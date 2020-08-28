import {combineReducers} from "redux";
import dialogsReducer from "./dialogs-reducer";
import profileReducer from "./profile-reducer";
import sideBarReducer from "./sidebar-reducer";
import loaderReducer from "./loader-reducer";
import usersReducer from "./users-reducer";
import authReducer from "./auth-reducer";
import musicReducer from "./music-reducer";
import postReducer from "./post-reducer";
import appReducer from "./app-reducer";
import { reducer as formReducer } from 'redux-form'

export default combineReducers({
  dialogsPage: dialogsReducer,
  profilePage: profileReducer,
  musicPage: musicReducer,
  sideBar: sideBarReducer,
  usersPage: usersReducer,
  loader: loaderReducer,
  auth: authReducer,
  post: postReducer,
  form: formReducer,
  app: appReducer
})
