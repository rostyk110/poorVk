import {reduxForm} from "redux-form";
import {createField, Input} from "../UI/FormControls/FormControls";
import {maxLength32, minLength6, required} from "../../utils/validators";
import classes from "./Login.module.css";
import React from "react";

let LoginForm = ({handleSubmit, error}) => {

  return (
    <form onSubmit={handleSubmit} className={classes.loginForm}>
      <span>Email</span>
      {createField("email", "Email", Input, [required, minLength6, maxLength32])}
      <span>Password</span>
      {createField("password", "Password", Input, [required, minLength6, maxLength32],
        {type: "password"})}
      { error && <div className={classes.error}>{error}</div> }
      <div className={classes.buttonsBlock}>
        <button  className={classes.btn} type="submit">Log in</button>
      </div>
    </form>
  )
}

export default LoginForm = reduxForm({
  form: 'login'
})(LoginForm)
