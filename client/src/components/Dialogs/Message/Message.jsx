import React from 'react';
import classes from '../Dialogs.module.css'

import deleteIcon from '../../../assets/images/deleteIcon.svg'
import doubleCheckMark from "../../../assets/images/doubleCheckMark.svg"
import checkMark from "../../../assets/images/checkMark.svg"
import editSvg from "../../../assets/images/edit.svg"
import {getFirstName} from "../../../utils/utils-funcs";

const Message = ({fullInfo, message, deleteMessage, setIdMessageToEdit, userId, socket, history}) => {
  const isUnread = fullInfo.isRead.length === 0
  const didIRead = fullInfo.user._id !== userId && !fullInfo.isRead.includes(userId)

  const handleDeleteMsg = () => {
    deleteMessage(fullInfo.dialog, fullInfo._id)
    socket.emit('delete message', {dialog: fullInfo.dialog, _id: fullInfo._id})
  }

  const goToProfile = () => {
    history.push(`/profile/${fullInfo.user._id}`)
  }

  return <div className={classes.messageWrapper + ' ' + (didIRead && classes.unreadMessage)}>
    <div className={classes.message}>
      <div className={classes.messageAvatar} onClick={goToProfile}>
        <img src={fullInfo.user.avatar} alt="avatar"/>
      </div>
      <div>
        <div className={classes.userNameWrapper}>
          <div className={classes.userName} onClick={goToProfile}>{getFirstName(fullInfo.user.fullName)}</div>
          <div className={classes.date}>{new Date(fullInfo.date).toLocaleTimeString().replace(/(.*)\D\d+/, '$1')}</div>
          {fullInfo.isEdited && <span className={classes.edited}>(edited)</span>}
          <div className={classes.checkMarkMessageBlock}>{userId === fullInfo.user._id && (!isUnread
            ? <img src={doubleCheckMark} alt="doubleCheckMark"/>
            : <img src={checkMark} alt="doubleCheckMark"/>)}
          </div>
        </div>
        <div className={classes.messageText}>{message}</div>
      </div>
    </div>
    {
      userId === fullInfo.user._id && <div className={classes.messageBtns}>
        <img onClick={() => setIdMessageToEdit(fullInfo._id)} src={editSvg} alt="editSvg"/>
        <img onClick={handleDeleteMsg} src={deleteIcon} alt="deleteIcon"/>
      </div>
    }
  </div>
}

export default Message;
