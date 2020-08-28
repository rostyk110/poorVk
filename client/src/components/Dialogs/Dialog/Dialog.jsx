import React, {useEffect, useState} from 'react';
import {NavLink} from "react-router-dom";
import classes from '../Dialogs.module.css'
import writingPencil from "../../../assets/images/writing-pencil-svgrepo-com.svg";
import Typed from "react-typed";
import doubleCheckMark from "../../../assets/images/doubleCheckMark.svg"
import checkMark from "../../../assets/images/checkMark.svg"
import {cutMessage, getFirstName} from "../../../utils/utils-funcs";

const Dialog = ({dialog, activeDialogId, setActiveDialog, socket, myfullName, typingUsers, userId, deleteDialog}) => {
  const isPublic = Boolean(dialog.participants)

  const currentDialogTypingUser = typingUsers.find(user => user.dialogId === dialog._id)
  const notReadMessages = dialog.messages ? dialog.messages.filter(m => !m.isRead.includes(userId) && m.user._id !== userId) : []
  const lastMessage = dialog.messages ? dialog.messages[dialog.messages.length - 1] : null

  const avatar = isPublic ? dialog.avatar : dialog.user.avatar
  const name = isPublic ? dialog.name : dialog.user.fullName
  const roomId = isPublic ? dialog._id : dialog.user._id
  const isOnline = isPublic ? null : dialog.user.online

  const path = `/dialogs/${roomId}`
  const MAX_LAST_MESSAGE_LENGTH = 21

  let firstName, allowablePublicLength, allowablePrivateLength;
  if (lastMessage) {
    firstName = getFirstName(lastMessage.user.fullName)
    // You: = 5, space = 1
    allowablePublicLength = MAX_LAST_MESSAGE_LENGTH - (userId === lastMessage.user._id ? 5 : firstName.length + 1)
    allowablePrivateLength = MAX_LAST_MESSAGE_LENGTH - (userId === lastMessage.user._id ? 5 : 1)
  }

  const isChecked = lastMessage && (lastMessage.user._id === userId && (!isPublic
    ? lastMessage.isRead.includes(roomId) : lastMessage.isRead.length > 0))
  const isNotChecked = lastMessage && (lastMessage.user._id === userId && (!isPublic
    ? !lastMessage.isRead.includes(roomId) : lastMessage.isRead.length === 0))

  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    if (activeDialogId) {
      return () => {
        socket.emit('stop typing', {username: myfullName, dialogId: activeDialogId});
      }
    }
  }, [activeDialogId])


  const deleteHandle = e => {
    e.preventDefault()
    deleteDialog(dialog._id)
    socket.emit('delete dialog', {_id: dialog._id})
    setActiveDialog(null)
  }

  return (
    <NavLink to={path} activeClassName={classes.active}>
      <div className={classes.dialog + ' ' + classes.active}>
        <div className={classes.dialogBlock}
             onMouseEnter={() => setIsShown(true)}
             onMouseLeave={() => setIsShown(false)}>
          <div className={classes.dialogBlockLeft}>
            <div className={classes.avatar}>
              <img src={avatar} alt="avatar"/>
              {isOnline && <div className={classes.online}/>}
            </div>
            <div className={classes.userInfo}>
              <div className={classes.fullName}>{name}</div>
              {
                currentDialogTypingUser
                  ? <div className={classes.typing}>
                    <img src={writingPencil} alt="writingPencil" style={{color: "gray"}}/>
                    <Typed strings={[`typing...`]} typeSpeed={40}/>
                  </div>
                  : <div>
                    {isPublic
                      ? <>
                        {
                          lastMessage && (
                            userId === lastMessage.user._id
                              ? <span className={classes.you}>You:</span>
                              : <span className={classes.you}>{firstName}:</span>)
                        }
                        {lastMessage && cutMessage(lastMessage.text, allowablePublicLength)}
                      </>
                      : <>
                        {lastMessage && (userId === lastMessage.user._id && <span className={classes.you}>You:</span>)}
                        {lastMessage && cutMessage(lastMessage.text, allowablePrivateLength)}
                      </>}

                  </div>
              }
            </div>
          </div>
          <div className={classes.dialogBlockRight}>
            {
              !isShown
                ? <div className={classes.checkMarkBlock}>
                  {isChecked && <img src={doubleCheckMark} alt="doubleCheckMark"/>}
                  {isNotChecked && <img src={checkMark} alt="checkMark"/>}

                  {lastMessage && <div
                    className={classes.date}>{new Date(lastMessage.date).toLocaleTimeString().replace(/(.*)\D\d+/, '$1')}</div>
                  }
                </div>
                : <div className={classes.deleteDialog} onClick={e => deleteHandle(e)}/>
            }
          </div>
          {notReadMessages.length > 0 &&
          <div className={classes.newMessages}>{notReadMessages.length}</div>}
        </div>
      </div>
    </NavLink>
  )
}

export default Dialog;
