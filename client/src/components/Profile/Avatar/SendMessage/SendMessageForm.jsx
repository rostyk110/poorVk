import React from "react";
import {reduxForm} from "redux-form";
import {createField, Textarea} from "../../../UI/FormControls/FormControls";
import {maxLength4096} from "../../../../utils/validators";
import classes from "./SendMessage.module.css"

let SendMessageForm = ({handleSubmit, submit}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.messageInput}>
        <div onKeyPress={e => e.key === 'Enter' && submit('dialogs')}>
          {createField("message", "your message...", Textarea, [maxLength4096], {autoFocus: true})}
        </div>
      </div>
      <div className={classes.bottomWrapper}>
        <button>Send</button>
      </div>
    </form>
  )
}

export default SendMessageForm = reduxForm({
  form: 'dialogs'
})(SendMessageForm)
