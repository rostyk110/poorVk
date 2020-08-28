import {reduxForm} from "redux-form";
import {createField, Textarea} from "../UI/FormControls/FormControls";
import React, {useState} from "react";
import classes from "./Dialogs.module.css"
import paperPlane from "../../assets/images/paper-plane.svg"
import {maxLength4096} from "../../utils/validators";

let AddMessageForm = ({handleSubmit, submit, activeDialogId, socket, username}) => {
  const [isTyping, setIsTyping] = useState(false)

  const onChangeHandler = e => {
    if (e.target.value.length > 0 && !isTyping) {
      socket.emit('typing', {username, dialogId: activeDialogId});
      setIsTyping(true)
    } else if (e.target.value.length === 0 && isTyping) {
      socket.emit('stop typing', {username, dialogId: activeDialogId});
      setIsTyping(false)
    }
  }

  const onKeyPressHandler = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setIsTyping(false)
      submit('dialogs')
    }
  }

  return (
    <div className={classes.input} onKeyPress={onKeyPressHandler}>
      <form onSubmit={handleSubmit}>
        {createField("message", "your message...", Textarea, [maxLength4096], {onChange: onChangeHandler})}
        <div className={classes.paperPlane}>
          <img src={paperPlane} alt="paperPlane" onClick={() => {
            setIsTyping(false)
            submit('dialogs')
          }}/>
        </div>
      </form>
    </div>
  )
}

export default AddMessageForm = reduxForm({
  form: 'dialogs'
})(AddMessageForm)
