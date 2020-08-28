import {reduxForm} from "redux-form";
import {createField, Input} from "../../../UI/FormControls/FormControls";
import React from "react";
import {maxLength300} from "../../../../utils/validators";
import paperPlane from "../../../../assets/images/paper-plane.svg";
import classes from "./Post.module.css";

let AddCommentForm = ({handleSubmit, submit}) => {
  return (
    <form onSubmit={handleSubmit}>
      {createField("comment", "Leave a comment...", Input, [maxLength300], {autoFocus: true})}
      <div className={classes.commentBtn} onClick={submit}>
        <img src={paperPlane} alt="paperPlane"/>
      </div>
    </form>
  )
}

export default AddCommentForm = reduxForm({
  form: 'comments'
})(AddCommentForm)
