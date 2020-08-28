import {
  GET_DIALOGS, POST_ERROR, SET_ACTIVE_DIALOG, TYPING, STOP_TYPING, SET_USER_ONLINE,
  SET_NOTIFY_RECEIVING_MESSAGES, CLEAR_NOTIFY_RECEIVING_MESSAGES, SET_MESSAGE_READ_SUCCESS, DELETE_MESSAGE_SUCCESS,
  SEND_MESSAGE_SUCCESS, CREATE_DIALOG_SUCCESS, DELETE_DIALOG_SUCCESS, EDIT_MESSAGE_SUCCESS
} from "../types";
import {messageAPI} from "../../api/api";
import {reset} from "redux-form";

export const getDialogs = () => async dispatch => {
  try {
    const res = await messageAPI.getDialogs();

    dispatch({
      type: GET_DIALOGS,
      payload: res.data
    });
  } catch (err) {
    console.log(err)
  }
};

export const createDialog = (participants, name, message) => async dispatch => {
  try {
    const res = await messageAPI.createDialog(participants, name, message);

    if (res.data.resultCode === 0) {
      if (res.data.data) {
        dispatch(createDialogSuccess(res.data.data))
        return res.data.data
      } else {
        dispatch(createDialogSuccess(res.data.owner))
        return res.data.enemy
      }
    }
  } catch (err) {
    console.log(err)
  }
}

export const sendMessage = (dialogRoomId, text) => async dispatch => {
  try {
    const res = await messageAPI.createMessage(dialogRoomId, text);

    if (res.data.resultCode === 0) {
      dispatch(sendMessageSuccess(res.data.data))
      dispatch(reset('dialogs'))

      return res.data.data
    }
  } catch (err) {
    console.log(err)
  }
}

export const deleteDialog = dialog => async dispatch => {
  try {
    const res = await messageAPI.deleteDialog(dialog);

    if (res.data.resultCode === 0) {
      dispatch(deleteDialogSuccess(dialog))
    }
  } catch (err) {
    console.log(err)
  }
}

export const deleteMessage = (dialog, _id) => async dispatch => {
  try {
    const res = await messageAPI.deleteMessage(dialog, _id);

    if (res.data.resultCode === 0) {
      dispatch(deleteMessageSuccess({dialog, _id}))
    }
  } catch (err) {
    console.log(err)
  }
}

export const setReadMessage = (dialog, _id, userId) => async dispatch => {
  try {
    const res = await messageAPI.readMessage(dialog, _id);

    if (res.data.resultCode === 0) {
      dispatch(setMessageReadSuccess(dialog, _id, userId))
    }
  } catch (err) {
    console.log(err)
  }
}

export const editMessage = (dialog, _id, newText) => async dispatch => {
  try {
    const res = await messageAPI.editMessage(dialog, _id, newText);

    if (res.data.resultCode === 0) {
      dispatch(editMessageSuccess(dialog, _id, newText))
      return {dialog, _id, newText}
    }
  } catch (err) {
    console.log(err)
  }
}

export const createDialogSuccess = dialog => {
  return {
    type: CREATE_DIALOG_SUCCESS,
    payload: dialog
  }
}

export const sendMessageSuccess = message => {
  return {
    type: SEND_MESSAGE_SUCCESS,
    payload: message
  }
}

export const deleteDialogSuccess = dialog => {
  return {
    type: DELETE_DIALOG_SUCCESS,
    payload: dialog
  }
}

export const deleteMessageSuccess = msg => {
  return {
    type: DELETE_MESSAGE_SUCCESS,
    payload: msg
  }
}

export const setMessageReadSuccess = (dialog, _id, userId) => {
  return {
    type: SET_MESSAGE_READ_SUCCESS,
    payload: {dialog, _id, userId}
  }
}

export const editMessageSuccess = (dialog, _id, newText) => {
  return {
    type: EDIT_MESSAGE_SUCCESS,
    payload: {dialog, _id, newText}
  }
}

export const setActiveDialog = id => {
  return {
    type: SET_ACTIVE_DIALOG,
    payload: id
  }
}

export const typing = data => {
  return {
    type: TYPING,
    payload: data
  };
}

export const stopTyping = data => {
  return {
    type: STOP_TYPING,
    payload: data
  };
}

export const handleUserOnline = (userId, isOnline) => {
  return {
    type: SET_USER_ONLINE,
    payload: {userId, isOnline}
  };
}

export const notifyReceivedMessage = msg => {
  return {
    type: SET_NOTIFY_RECEIVING_MESSAGES,
    payload: msg
  };
}
export const clearNotifyReceivedMessage = msg => {
  return {
    type: CLEAR_NOTIFY_RECEIVING_MESSAGES,
    payload: msg._id
  };
}
