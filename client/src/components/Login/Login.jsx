import React from 'react';
import {connect} from "react-redux";
import {login} from "../../redux/actions/auth-action";
import LoginForm from "./LoginForm";

const Login = ({login}) => {
  const handleLoginSubmit = fields => {
    login(fields)
  }

  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      <LoginForm onSubmit={handleLoginSubmit}/>
    </div>
  );
}


export default connect(null, {login})(Login);
