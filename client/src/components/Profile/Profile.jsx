import React from 'react';
import {compose} from "redux";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import MyPosts from "./MyPosts/MyPosts";
import {
  getUserStatus, setIsEditMode,
  setUserProfile,
  updateUserProfile,
  updateUserStatus,
  uploadPhoto
} from "../../redux/actions/profile-action";
import Loader from "../UI/Loader/Loader";
import classes from './Profile.module.css'
import {hideLoader, showLoader} from "../../redux/actions/loader-action.js";
import {createDialog, sendMessage} from "../../redux/actions/dialogs-action";
import {withAuthRedirect} from "../hoc/WithAuthRedirect/withAuthRedirect";
import {followUser, unfollowUser} from "../../redux/actions/users-action";
import Avatar from "./Avatar/Avatar";
import AboutMe from "./AboutMe/AboutMe";
import Friends from "./Friends/Friends";

class Profile extends React.Component {
  getUserProfile() {
    const userId = this.props.match.params.id || this.props.authedUserId

    if (!userId) {
      this.props.history.push('/')
    } else {
      this.props.setUserProfile(userId)
      this.props.getUserStatus(userId)

    }
  }

  componentDidMount() {
    this.getUserProfile()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.getUserProfile()
    }

    if (!this.props.authedUserId && !this.props.match.params.id) {
      this.getUserProfile()
    }

    if (prevProps.userProfile !== this.props.userProfile) {
      if (this.props.userProfile) {
        document.title = this.props.userProfile.user.fullName
      }
    }
  }

  render() {
    return (
      this.props.isLoading || !this.props.userProfile
        ? <Loader/>
        : <div className={classes.profile}>
            <div className={classes.leftSide}>
              <Avatar {...this.props} />
              <Friends following={this.props.userProfile.user.following} />
            </div>
            <div className={classes.rightSide}>
              <AboutMe {...this.props}/>
              <MyPosts />
            </div>
        </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    users: state.usersPage.users,
    isInFollowingProgress: state.usersPage.isInFollowingProgress,
    userProfile: state.profilePage.userProfile,
    dialogs: state.dialogsPage.dialogs,
    isLoading: state.loader.isLoading,
    status: state.profilePage.status,
    isEditMode: state.profilePage.isEditMode,
    authedUserId: state.auth.userId,
    error: state.profilePage.error,
    avatar: state.auth.avatar,
    following: state.auth.following,
    isAuth: state.auth.isAuth,
    socket: state.auth.socket
  }
}

export default compose(
  connect(mapStateToProps, {
    setUserProfile,
    getUserStatus,
    updateUserStatus,
    uploadPhoto,
    updateUserProfile,
    showLoader,
    sendMessage,
    hideLoader,
    createDialog,
    followUser,
    setIsEditMode,
    unfollowUser
  }),
  withAuthRedirect,
  withRouter
)(Profile)
