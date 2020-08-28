import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {compose} from "redux";
import {
  deleteMessage, sendMessage, setActiveDialog, handleUserOnline,
  stopTyping, setReadMessage, clearNotifyReceivedMessage, createDialog, deleteDialog, editMessage, getDialogs,
} from "../../redux/actions/dialogs-action";
import {withAuthRedirect} from "../hoc/WithAuthRedirect/withAuthRedirect";
import Messages from "./Messages/Messages";
import Dialog from "./Dialog/Dialog";
import classes from './Dialogs.module.css'
import {change, submit, reset} from "redux-form";
import {withRouter} from "react-router-dom";

import plusSvg from "../../assets/images/plus.svg"
import closeSvg from "../../assets/images/close.svg"
import searchSvg from "../../assets/images/search_icon.png"
import emptySvg from "../../assets/images/empty_icon.png"
import {sortByLastMessage} from "../../utils/utils-funcs";

const Dialogs = props => {
  const {dialogsPage, match, userId, fullName, socket, following, history, activeDialogId} = props
  const {
    getMessages, clearMessages, setActiveDialog, setPenFriendReadMessage, deleteMessage, change, reset, sendMessage,
    clearNotifyReceivedMessage, setReadMessage, createDialog, deleteDialog, editMessage, getDialogs
  } = props

  const [isCreateMode, setIsCreateMode] = useState(false)
  const [checked, setChecked] = useState([])
  const [dialogName, setDialogName] = useState('')
  const [dialogToSearch, setDialogToSearch] = useState('')

  let dialogs = dialogsPage.dialogs.filter(d => d.lastMessage).sort(sortByLastMessage)

  if (dialogToSearch) {
    dialogs = dialogsPage.dialogs.filter(d => {
      if (d.user) {
        return d.user.fullName.toLowerCase().includes(dialogToSearch.toLowerCase())
      } else {
        return d.name.includes(dialogToSearch)
      }
    })
  }

  useEffect(() => {
    document.title = "Messages"
    getDialogs()
    return () => {
      setActiveDialog(null)
    }
  }, [])

  useEffect(() => {
    setActiveDialog(null)

    if (match.params.id) {
      const dialog = dialogsPage.dialogs.find(d => {
        if (d.user) {
          return d.user?._id === match.params.id
        }
        return d._id === match.params.id
      })

      if (dialog && dialog._id) {
        setActiveDialog(dialog._id)

        dialog.messages.forEach(msg => {
          if (!msg.isRead.includes(userId) && msg.user._id !== userId) {
            clearNotifyReceivedMessage(msg)
          }
        })

      } else {
        history.push('/dialogs')
      }
    }
  }, [match.params.id])

  const toggleCheckUser = userId => {
    setChecked(prevState => {
      if (prevState.includes(userId)) {
        return prevState.filter(id => id !== userId)
      } else {
        return [...prevState, userId]
      }
    })
  }

  const handleCreateChatBtn = async () => {
    if (checked.length === 1) {
      let dialog = dialogsPage.dialogs.find(d => d.user && d.user._id === checked[0])

      if (!dialog) {
        dialog = await createDialog(checked)
        socket.emit('new dialog', checked, dialog)
      }
      setChecked([])
      setIsCreateMode(false)

      history.push('/dialogs/' + dialog.user._id)
    } else {
      if (dialogName) {
        const dialog = await createDialog(checked, dialogName)
        socket.emit('new dialog', checked, dialog)
        setChecked([])
        setIsCreateMode(false)

        history.push('/dialogs/' + dialog._id)
      }
    }
  }

  return (
    <div className={classes.dialogs}>
      <div className={classes.dialogsItems}>
        {
          !isCreateMode
            ? <>
              <div className={classes.header}>
                <div className={classes.searchWrapper}>
                  <input type="text" placeholder="Search" onChange={e => setDialogToSearch(e.target.value)}
                         value={dialogToSearch}/>
                  <i><img src={searchSvg} alt="searchSvg"/></i>
                </div>
                <i className={classes.plus} onClick={() => setIsCreateMode(true)}>
                  <img src={plusSvg} alt="plusSvg"/>
                </i>
              </div>
              {dialogs.map((d, index) => {
                return <Dialog dialog={d} key={index} getMessages={getMessages} clearMessages={clearMessages}
                               userId={userId} socket={socket} setActiveDialog={setActiveDialog} myfullName={fullName}
                               typingUsers={dialogsPage.typingUsers} activeDialogId={dialogsPage.activeDialogId}
                               clearNotifyReceivedMessage={clearNotifyReceivedMessage} history={history}
                               setPenFriendReadMessage={setPenFriendReadMessage} deleteDialog={deleteDialog}/>
              })}
            </>
            : <>
              <div className={classes.header}>
                <span><b>Create group chat</b></span>
                <i className={classes.close} onClick={() => setIsCreateMode(false)}>
                  <img src={closeSvg} alt="closeSvg"/>
                </i>
              </div>
              <div className={classes.dialogName}>
                <input type="text" placeholder="Enter a chat name" value={dialogName}
                       onChange={e => setDialogName(e.target.value)}/>
              </div>

              <div className={classes.followingList}>
                {
                  following.map((user, index) => (
                    <div key={index} className={classes.followingUserWrapper} onClick={() => toggleCheckUser(user._id)}>
                      <div className={classes.followingUser}>
                        <div className={classes.followingUserLeft}>
                          <div className={classes.followingUserAvatar}>
                            <img src={user.avatar} alt="avatar"/>
                          </div>
                          <div className={classes.followingUserFullName}>{user.fullName}</div>
                        </div>
                        <div className={classes.followingUserRight}>
                          {
                            checked.includes(user._id)
                              ? <div className={classes.checked}/>
                              : <div className={classes.unchecked}/>
                          }
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div className={classes.bottomCreateChat}>
                <button onClick={handleCreateChatBtn} disabled={checked.length === 0}>Create chat</button>
                <span onClick={() => setIsCreateMode(false)}>Cancel</span>
              </div>
            </>
        }

      </div>
      <div className={classes.messages}>
        {!dialogsPage.activeDialogId
          ? <div className={classes.emptyDialogs}>
            <div>
              <img src={emptySvg} alt="emptySvg"/>

            </div>
            <div>
              <span className={classes.firstText}>Select a chat or</span>
              <span className={classes.secondText} onClick={() => setIsCreateMode(true)}> create a new <br/> one</span>
            </div>
          </div>
          : <Messages
            dialogsPage={dialogsPage} setReadMessage={setReadMessage} history={history} deleteMessage={deleteMessage}
            userId={userId} activeDialogId={activeDialogId} socket={socket} fullName={fullName}
            sendMessage={sendMessage} editMessage={editMessage} change={change} reset={reset}
            dialogs={dialogsPage.dialogs} typingUsers={dialogsPage.typingUsers}/>}
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    dialogsPage: state.dialogsPage,
    isAuth: state.auth.isAuth,
    following: state.auth.following,
    userId: state.auth.userId,
    fullName: state.auth.fullName,
    activeDialogId: state.dialogsPage.activeDialogId,
    socket: state.auth.socket
  }
}

export default compose(
  connect(mapStateToProps, {
    sendMessage,
    deleteMessage,
    setActiveDialog,
    stopTyping,
    handleUserOnline,
    getDialogs,
    setReadMessage,
    clearNotifyReceivedMessage,
    createDialog,
    deleteDialog,
    editMessage,
    change,
    reset,
    submit
  }),
  withAuthRedirect,
  withRouter
)(Dialogs)
