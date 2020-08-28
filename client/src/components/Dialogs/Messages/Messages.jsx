import React, {useEffect, useState} from 'react';
import classes from "../Dialogs.module.css";
import Message from "../Message/Message";
import writingPencil from "../../../assets/images/writing-pencil-svgrepo-com.svg";
import Typed from "react-typed";
import AddMessageForm from "../AddMessageForm";
import {reset, submit} from "redux-form";
import {formatDate, formatTypeWritersName, structuralMessages} from "../../../utils/utils-funcs";
import downArrow from "../../../assets/images/down-arrow.svg"
import {NavLink} from "react-router-dom";
import {debounce} from 'lodash'

const Messages = props => {
  const {history, dialogs, userId, activeDialogId, socket, fullName, typingUsers} = props
  const {setReadMessage, deleteMessage, sendMessage, editMessage, change, reset} = props

  const [idMessageToEdit, setIdMessageToEdit] = useState(null)

  const currentDialog = dialogs.find(d => d._id === activeDialogId)
  const messages = currentDialog ? currentDialog.messages : []

  const currentDialogTypingUsers = typingUsers.filter(user => user.dialogId === activeDialogId)
  const formattedTypeWriters = formatTypeWritersName(currentDialogTypingUsers)
  const finalMessages = structuralMessages(messages, userId)
  const firstNotReadMessage = messages.find(m => !m.isRead.includes(userId) && m.user._id !== userId)
  const lastReadMessage = currentDialog.lastReadMessage
  const lastMessage = messages[messages.length - 1]

  const messagesWrapperRef = React.createRef()
  const firstNotReadMessageRef = React.createRef()
  const lastReadMessageRef = React.createRef()
  const lastMessageRef = React.createRef()

  const [showToBottom, setShowToBottom] = React.useState(false)

  useEffect(() => {
    if (lastMessage) {
      onScrollHandler()
    }

    if (lastMessage && (lastMessage?.user?._id === userId || lastMessage.isRead.includes(userId))) {
      lastMessageRef.current.scrollIntoView()
    } else if (lastReadMessage) {
      lastReadMessageRef.current.scrollIntoView({block: "end"})
    }
  }, [messages, lastMessage])

  const isLastElement = (i, j, arrI, arrJ) => {
    return i === arrI.length - 1 && j === arrJ.length - 1
  }

  const sendClickHandler = async fields => {
    if (fields.message) {
      let msg

      if (currentDialog.user) {
        msg = await sendMessage(activeDialogId, fields.message)
      } else {
        msg = await sendMessage(currentDialog._id, fields.message)
      }

      socket.emit('chat message', msg);
      socket.emit('stop typing', {username: fullName, dialogId: activeDialogId});
    }
  }

  const scrollBottom = () => {
    lastMessageRef.current.scrollIntoView({behavior: "smooth"})
  }

  const onMyScroll = () => {
    const scrollHeightY = messagesWrapperRef?.current?.scrollHeight
    const scrollTopY = messagesWrapperRef?.current?.scrollTop
    const offsetHeightY = messagesWrapperRef?.current?.offsetHeight

    if (scrollHeightY - scrollTopY >= offsetHeightY * 2.5) {
      setShowToBottom(true)
    } else {
      setShowToBottom(false)
    }
  }

  const onScrollHandler = () => {
    if (messagesWrapperRef && firstNotReadMessageRef && firstNotReadMessage && firstNotReadMessage.user._id !== userId) {
      const offsetTop = firstNotReadMessageRef?.current?.offsetTop
      const scrollHeight = firstNotReadMessageRef?.current?.scrollHeight
      const scrollTop = messagesWrapperRef?.current?.scrollTop
      const offsetHeight = messagesWrapperRef?.current?.offsetHeight

      if (Math.round(offsetTop) <= Math.round(scrollTop + offsetHeight)) {

        if (firstNotReadMessage.user._id !== userId) {
          const index = messages.indexOf(firstNotReadMessage)

          let amountReadMessages;

          if (scrollTop > 0) {
            amountReadMessages = Math.ceil((scrollTop + offsetHeight - offsetTop) / scrollHeight)
          } else {
            amountReadMessages = messages.reduce((acc, msg) => (
              !msg.isRead.includes(userId) && msg.user._id !== userId ? acc + 1 : acc
            ), 0)
          }

          for (let i = index; i < index + amountReadMessages; i++) {
            socket.emit('set message read', firstNotReadMessage.dialog, messages[i]._id, userId)
            setReadMessage(firstNotReadMessage.dialog, messages[i]._id, userId)
          }
        }
      }
    }
  }

  const onScrollThrottled = debounce(onScrollHandler, 100)

  const messageToEdit =  messages.find(m => m._id === idMessageToEdit)?.text

  const editMessageHandler = async fields => {
    if (messageToEdit !== fields.message) {
      const newMsg = await editMessage(currentDialog._id, idMessageToEdit, fields.message)
      socket.emit('edit message', newMsg)
      socket.emit('stop typing', {username: fullName, dialogId: activeDialogId});
    }
    reset('dialogs')
    setIdMessageToEdit(null)
  }

  useEffect(() => {
    if (idMessageToEdit) {
      change('dialogs', 'message', messageToEdit)
    }
  }, [idMessageToEdit])

  return (
    <>
      <div className={classes.header}>
        <div className={classes.headerLeft}>
          <div className={classes.headerLeftFullName}>
            <NavLink to={"/profile/" + (currentDialog.user ? currentDialog.user._id : currentDialog._id)}
                     target="_blank">
              {currentDialog.user ? currentDialog.user.fullName : currentDialog.name}
            </NavLink>

          </div>
          {
            currentDialog.user && <div className={classes.headerLeftDate}>
              {!currentDialog.user.online
                ? <span>last seen {formatDate(currentDialog.user.date)}</span>
                : <span>online</span>
              }
            </div>
          }
        </div>
        <div>
          <div className={classes.headerRight}>
            <img src={currentDialog.user ? currentDialog.user.avatar : currentDialog.avatar} alt="avatar"/>
          </div>
        </div>
      </div>
      <div className={classes.messagesWrapper} ref={messagesWrapperRef} onScroll={() => {
        onMyScroll()
        onScrollThrottled()
      }}>
        {!messages.length
          ? <div className={classes.emptyMessages}>
            Your message history will be displayed here.
          </div>
          : <>
            {Object.keys(finalMessages).map((block, i) => (
              <div key={i}>
                <div className={classes.headerDate}>{block}</div>
                {finalMessages[block].map((m, index) => {
                  const isLast = isLastElement(i, index, Object.keys(finalMessages), finalMessages[block])
                  return <div ref={m.isFirstUnread ? firstNotReadMessageRef : null} key={index}>
                    <div ref={m._id === currentDialog?.lastReadMessage?._id ? lastReadMessageRef : null}>
                      <div ref={isLast ? lastMessageRef : null}>
                        <Message fullInfo={m} message={m.text} name={m.name} avatar={m.avatar} key={index}
                                 deleteMessage={deleteMessage} userId={userId} socket={socket} history={history}
                                 editMessage={editMessage} setIdMessageToEdit={setIdMessageToEdit}/>
                      </div>
                    </div>
                  </div>
                })
                }
              </div>
            ))}

            {
              currentDialogTypingUsers.length > 0 && <div
                className={classes.typerName}>
                <img src={writingPencil} alt="writingPencil" style={{color: "gray"}}/>
                <span>{formattedTypeWriters}</span>
                {/*<Typed strings={[formattedTypeWriters]} typeSpeed={40}/>*/}
              </div>
            }
          </ >
        }
        <AddMessageForm onSubmit={idMessageToEdit ? editMessageHandler : sendClickHandler} socket={socket} submit={submit}
                        activeDialogId={activeDialogId} username={fullName}/>

        {showToBottom && <div className={classes.scrollBottom} onClick={scrollBottom}>
          <img src={downArrow} alt="downArrow"/>
        </div>}
      </div>
    </>
  );
}

export default Messages;
