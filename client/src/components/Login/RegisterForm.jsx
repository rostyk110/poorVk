import React from "react";
import {reduxForm} from "redux-form";
import {createField, Input} from "../UI/FormControls/FormControls";
import {maxLength32, minLength6, required} from "../../utils/validators";
import classes from "./Register.module.css";

let RegisterForm = ({handleSubmit, error}) => {
  return (
    <div className={classes.registerForm}>
      <form onSubmit={handleSubmit}>
        {createField("fullName", "Full name", Input, [required, maxLength32])}
        {createField("email", "Email", Input, [required, minLength6, maxLength32])}
        {createField("password", "Password", Input, [required, minLength6, maxLength32],
          {type: "password"})}
        {error && <div className={classes.error}>{error}</div>}
        <div>
          <button type="submit" className={classes.btn}>Register</button>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm = reduxForm({
  form: 'register'
})(RegisterForm)
