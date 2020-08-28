import React from "react";
import {reduxForm} from "redux-form";
import {createField, Input, Textarea} from "../../../UI/FormControls/FormControls";
import {maxLength100, maxLength32} from "../../../../utils/validators";
import classes from "./Description.module.css";

let DescriptionForm = ({handleSubmit, error, user}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.descBlock}>
        <div className={classes.descItem}>
          <div className={classes.descTitle}>Full name:</div>
          {createField("fullName", "Full name", Input, [maxLength32])}
        </div>
        <div className={classes.descItem}>
          <div className={classes.descTitle}>About me:</div>
          {createField("aboutMe", "About me", Input, [maxLength100])}
        </div>
        <div className={classes.descItem}>
          <div className={classes.descTitle}>Looking for a job:</div>
          {createField("lookingForAJob", "", Input, [], {type: "checkbox"})}
        </div>
        <div className={classes.descItem}>
          <div className={classes.descTitle}>Professional skills:</div>
          {createField("lookingForAJobDescription", "Professional skills", Textarea, [maxLength100])}
        </div>
      </div>

      <div className={classes.descBlock}>
        <div className={classes.descBlockLabel}>Contacts:</div>
        {
          Object.keys(user.contacts).map(key => {
            return <div className={classes.descItem}>
              <div className={classes.descTitle}>{key}:</div>
              <div className={classes.descValue}>
                {createField("contacts." + key, key, Input, [maxLength100])}
              </div>
            </div>
          })
        }
      </div>
      {
        error && <div className={classes.error}>{error}</div>
      }
      <button className={classes.btn}>Save changes</button>
    </form>
  )
}

DescriptionForm = reduxForm({
  form: 'profile-description'
})(DescriptionForm)


export default DescriptionForm;
