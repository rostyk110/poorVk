import {
  CLEAR_NOTIFY_RECEIVING_MESSAGES,
  DELETE_MESSAGE_SUCCESS,
  GET_DIALOGS,
  LOGOUT,
  SEND_MESSAGE_SUCCESS,
  SET_ACTIVE_DIALOG,
  SET_NOTIFY_RECEIVING_MESSAGES,
  SET_MESSAGE_READ_SUCCESS,
  SET_USER_ONLINE,
  STOP_TYPING,
  TYPING, CREATE_DIALOG_SUCCESS, DELETE_DIALOG_SUCCESS, EDIT_MESSAGE_SUCCESS
} from "../types";
import {sortByLastMessage} from "../../utils/utils-funcs";

const initialState = {
  dialogs: [],
  typingUsers: [],
  messagesToNotify: [],
  activeDialogId: null
}

const dialogsReducer = (state = initialState, action) => {
  const {type, payload} = action

  const newDialog = messageType => {
    return state.dialogs.map(dialog => {
      if (dialog._id === payload.dialog) {
        const msgs = dialog.messages

        switch (messageType) {
          case 'get':
            return {...dialog, messages: [...msgs, payload], lastMessage: payload}
          case 'delete':
            const newMessages = msgs.filter(msg => msg._id !== payload._id)
            return {...dialog, messages: newMessages, lastMessage: newMessages[newMessages.length - 1]}
          case 'set read':
            const readMsgIndex = msgs.findIndex(msg => msg._id === payload._id)
            msgs[readMsgIndex].isRead.push(payload.userId)
            return {...dialog}
          case 'edit message':
            const editMessageIndex = msgs.findIndex(msg => msg._id === payload._id)
            dialog.messages[editMessageIndex].text = payload.newText
            dialog.messages[editMessageIndex].isEdited = true
            return {...dialog, messages: dialog.messages}
        }
      } else {
        return dialog
      }
    })
  }

  switch (type) {
    case GET_DIALOGS:
      return {
        ...state,
        dialogs: payload
      }
    case SET_ACTIVE_DIALOG:
      return {
        ...state,
        activeDialogId: payload
      }
    case CREATE_DIALOG_SUCCESS:
      return {
        ...state,
        dialogs: [...state.dialogs, payload]
      }
    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        dialogs: newDialog('get')
      }
    case DELETE_DIALOG_SUCCESS:
      return {
        ...state,
        dialogs: state.dialogs.filter(d => d._id !== payload)
      }
    case DELETE_MESSAGE_SUCCESS:
      return {
        ...state,
        dialogs: newDialog('delete')
      }
    case SET_MESSAGE_READ_SUCCESS:
      return {
        ...state,
        dialogs: newDialog('set read')
      }
    case EDIT_MESSAGE_SUCCESS:
      return {
        ...state,
        dialogs: newDialog('edit message')
      }
    case TYPING:
      const isUserTyping = state.typingUsers.find(u => {
        return u.username === payload.username && u.dialogId === payload.dialogId
      })
      if (!isUserTyping) {
        return {
          ...state,
          typingUsers: [...state.typingUsers, payload]
        }
      }
      return state;
    case STOP_TYPING:
      return {
        ...state,
        typingUsers: state.typingUsers.filter(user => {
          return user.username !== payload.username && user.dialogId !== payload.dialogId
        })
      }
    case SET_USER_ONLINE:
      return {
        ...state,
        dialogs: state.dialogs.map(dialog => (
          dialog.user && dialog.user._id === payload.userId
            ? {...dialog, user: {...dialog.user, online: payload.isOnline}}
            : dialog
        ))
      }
    case SET_NOTIFY_RECEIVING_MESSAGES:
      const messagesToNotify = state.messagesToNotify.length === 3
        ? [...state.messagesToNotify.slice(1), payload]
        : [...state.messagesToNotify, payload]

      return {
        ...state,
        messagesToNotify
      }
    case CLEAR_NOTIFY_RECEIVING_MESSAGES:
      return {
        ...state,
        messagesToNotify: state.messagesToNotify.filter(m => m._id !== payload)
      }
    case LOGOUT:
      return {
        dialogs: [],
        typingUsers: [],
        messagesToNotify: [],
        activeDialogId: null
      }
    default:
      return state
  }
}

export default dialogsReducer;
