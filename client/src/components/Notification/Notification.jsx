import React from 'react';
import {connect} from "react-redux";
import classes from './Notification.module.css'
import soundNotification from "../../assets/sounds/notification.mp3";
import {clearNotifyReceivedMessage} from "../../redux/actions/dialogs-action";
import {withRouter} from "react-router-dom";
import {compose} from "redux";
import {cutMessage} from "../../utils/utils-funcs";

const Notification = props => {
  const MAX_PRIVATE_MESSAGE_LENGTH = 60
  const MAX_PUBLIC_MESSAGE_LENGTH = 54

  const onClickHandle = (message, isPublic) => {
    props.history.push(`/dialogs/${!isPublic ? message.user._id : message.dialog}`)
    props.clearNotifyReceivedMessage(message)
  }

  const onClose = (e, message) => {
    e.stopPropagation()
    props.clearNotifyReceivedMessage(message)
  }

  const hideAll = () => {
    props.messagesToNotify.forEach(m => {
      props.clearNotifyReceivedMessage(m)
    })
  }

  return (
    <div className={classes.messagesNotificationWrapper}>
      {
        props.messagesToNotify.length > 1 &&
        <div className={classes.messagesHideAll} onClick={hideAll}>
          Hide all
        </div>
      }
      {
        props.messagesToNotify.filter(m => m.user._id !== props.userId).map(message => {
            const isPublic = message.participants && message.participants.length > 2

            return <>
              <div onClick={() => onClickHandle(message, isPublic)}>
                <audio autoPlay={true}>
                  <source src={soundNotification}/>
                </audio>
                <div className={classes.messagesNotification}>
                  <div className={classes.messagesNotificationAvatar}>
                    <img src={isPublic ? message.avatar : message.user.avatar} alt=""/>
                  </div>
                  <div className={classes.messagesNotificationMain}>
                    <div className={classes.messagesNotificationHeader}>
                      <div
                        className={classes.messagesNotificationUserName}>{isPublic ? message.name : message.user.fullName}</div>
                      <div className={classes.close} onClick={e => onClose(e, message)}/>
                    </div>
                    <div className={classes.messagesNotificationText}>
                      <div className={classes.notificationText}>
                        {isPublic && <b>{message.user.fullName.split(' ')[0]}: </b>}
                        {cutMessage(message.text, isPublic ? MAX_PUBLIC_MESSAGE_LENGTH : MAX_PRIVATE_MESSAGE_LENGTH)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
        )}
    </div>)
}

const mapStateToProps = state => {
  return {
    messagesToNotify: state.dialogsPage.messagesToNotify,
    userId: state.auth.userId
  }
}

export default compose(
  connect(mapStateToProps, {clearNotifyReceivedMessage}),
  withRouter
)(Notification)
