import React from 'react';
import {submit} from "redux-form";
import SendMessageForm from "./SendMessage/SendMessageForm";
import classes from "./Avatar.module.css";

const Avatar = props => {
  const {userProfile, authedUserId, following, avatar, dialogs, isInFollowingProgress, socket, isEditMode, error} = props
  const {uploadPhoto, followUser, unfollowUser, createDialog, sendMessage, setIsEditMode} = props

  const [showMessageModal, setShowMessageModal] = React.useState(false)

  const isMyProfile = authedUserId === userProfile.user._id
  const amFollowing = following.find(f => f._id === userProfile.user._id)
  const isDisabled = isInFollowingProgress.includes(userProfile.user._id)

  const handleCloseButton = () => setShowMessageModal(false)
  const messageClickHandler = () => setShowMessageModal(true)
  const editClickHandler = () => setIsEditMode(true)

  const submitFileUploading = e => {
    if (e.target.files.length) {
      uploadPhoto(e.target.files[0])
    }
  }

  const sendClickHandler = async fields => {
    let dialog = dialogs.find(d => d.user && d.user._id === userProfile.user._id)

    if (!dialog) {
      dialog = await createDialog([userProfile.user._id], null, fields.message)
      socket.emit('new dialog', [userProfile.user._id], dialog)
    } else {
      const msg = await sendMessage(dialog._id, fields.message)
      socket.emit('chat message', msg);
    }
    setShowMessageModal(false)
  }

  return (
    <div>
      <div className={classes.avatarWrapper}>
        <div className={classes.imageBlock}>
          <img className={classes.photo} src={isMyProfile ? avatar : userProfile.user.avatar} alt="avatar"/>
          {
            isMyProfile && <div className={classes.modalPhoto}>
              <label className={classes.label} htmlFor="file-upload">
                Upload photo
              </label>
              <input hidden={true} id="file-upload" type="file" onChange={submitFileUploading}/>
            </div>
          }
          {error && <div className={classes.error}>{error}</div>}
        </div>
        {isMyProfile
          ? !isEditMode &&
          <button className={classes.btn} onClick={editClickHandler}>Edit profile</button>
          : <div>
            <button className={classes.sendButton + " " + classes.btn} onClick={messageClickHandler}>Send
              message
            </button>
            {
              amFollowing
                ? <button disabled={isDisabled} className={classes.unfollowButton + " " + classes.btn}
                          onClick={() => {
                            unfollowUser(userProfile.user._id)
                          }}>Unfollow</button>
                : <button disabled={isDisabled} className={classes.followButton + " " + classes.btn}
                          onClick={() => {
                            followUser(userProfile.user._id)
                          }}>Follow</button>
            }

          </div>}
      </div>

      {
        showMessageModal && <div className={classes.messageModalWrapper}>
          <div className={classes.messageModal}>
            <div className={classes.messageModalHeader}>
              <div className={classes.text}>New message</div>
              <button className={classes.btn} onClick={handleCloseButton}>Close</button>
            </div>
            <div>
              <div className={classes.userBlock}>
                <div className={classes.image}>
                  <img src={userProfile.user.avatar} alt="avatar"/>
                </div>
                <div className={classes.userInfo}>
                  <span className={classes.name}>{userProfile.user.name}</span>
                  <span>online</span>
                </div>
              </div>
              <SendMessageForm onSubmit={sendClickHandler} submit={submit}/>
            </div>
          </div>
        </div>
      }
    </div>

  )
}

export default Avatar;
