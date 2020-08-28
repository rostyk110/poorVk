import React from 'react';
import classes from './Reply.module.css'
import {formatDate, getFirstName} from "../../../../../../utils/utils-funcs";

import deleteIcon from '../../../../../../assets/images/deleteIcon.svg'

const Reply = ({reply, history, deleteReply, userId, postId, commentId, setIsClickedOnReplyName}) => {
  const goToProfile = () => {
    history.push(`/profile/${reply.user}`)
  }

  const handleClickOnReply = () => {
    setIsClickedOnReplyName(true)

    setTimeout(() => {
      setIsClickedOnReplyName(false)
    }, 2000)
  }

  return (
    <div className={classes.mainWrapper}>
      <div className={classes.replyWrapper}>
        <div className={classes.replyAvatar} onClick={goToProfile}>
          <img src={reply.user.avatar} alt="avatar"/>
        </div>
        <div className={classes.replyRightBlock}>
          <div className={classes.replyFullName} onClick={goToProfile}>{reply.user.fullName}</div>
          <div className={classes.replyTo}>
            <span onClick={handleClickOnReply}>{getFirstName(reply.to.user.fullName)}</span>, {reply.text}
          </div>
          <div className={classes.replyDate}>{formatDate(reply.date)}</div>
        </div>
      </div>
      <div className={classes.deleteReply}>
        {reply.user._id === userId   // || userProfile.user._id === userId  //my comment or my profile
          ? <img src={deleteIcon} alt="deleteIcon" onClick={() => deleteReply(postId, commentId, reply._id)}/>
          : null
        }
      </div>
    </div>
  )
}

export default Reply;
