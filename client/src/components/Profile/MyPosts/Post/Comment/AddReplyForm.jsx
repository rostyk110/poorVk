import React from "react";
import {reduxForm} from "redux-form";
import {createField, Input} from "../../../../UI/FormControls/FormControls";
import {maxLength100} from "../../../../../utils/validators";
import paperPlane from "../../../../../assets/images/paper-plane.svg";
import classes from "./Comment.module.css";

let AddReplyForm = ({handleSubmit, submit}) => {
  return (
    <form onSubmit={handleSubmit}>
      {createField("reply", "Leave a reply...", Input, [maxLength100], {autoFocus: true})}
      <div className={classes.replyBtn} onClick={submit}>
        <img src={paperPlane} alt="paperPlane" />
      </div>
    </form>
  )
}

export default AddReplyForm = reduxForm({
  form: 'replies'
})(AddReplyForm)
