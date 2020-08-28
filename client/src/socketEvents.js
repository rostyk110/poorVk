import {editMessageSuccess} from "./redux/actions/dialogs-action";

export default function (socket, props) {
  socket.removeAllListeners()

  props.dialogs.forEach(dialog => {
    socket.emit('join dialog', {id: dialog._id})
  })

  socket
    .on('sign in bc', userId => {
      props.handleUserOnline(userId, true)
    })
    .on('new bc dialog', dialog => {
      if (dialog.messages.length === 1) {
        props.notifyReceivedMessage(dialog.messages[0])

        setTimeout(() => {
          props.clearNotifyReceivedMessage(dialog.messages[0])
        }, 10000)
      }
      props.createDialogSuccess(dialog)
    })
    .on('new bc message', msg => {
      props.sendMessageSuccess(msg)

      if (msg.dialog !== props.activeDialogId) {
        props.notifyReceivedMessage(msg)
      }

      setTimeout(() => {
        props.clearNotifyReceivedMessage(msg)
      }, 10000)
    })
    .on('delete bc message', msg => {
      props.deleteMessageSuccess(msg)
    })
    .on('edit bc message', msg => {
      const {dialog, _id, newText} = msg
      props.editMessageSuccess(dialog, _id, newText)
    })
    .on('delete bc dialog', dialog => {
      props.deleteDialogSuccess(dialog._id)
    })
    .on('set bc message read', (dialog, _id, userId) => {
      props.setMessageReadSuccess(dialog, _id, userId)
    })
    .on('typing bc', data => {
      props.typing(data)
    })
    .on('stop typing bc', data => {
      props.stopTyping(data)
    })
    .on('sign out bc', userId => {
      props.handleUserOnline(userId, false)
    })
}
