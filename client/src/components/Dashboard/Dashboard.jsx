import React, {useEffect} from 'react';
import {Redirect} from "react-router-dom";
import {connect} from "react-redux"
import {register, setOnline} from "../../redux/actions/auth-action";
import classes from "./Dashboard.module.css"
import RegisterForm from "../Login/RegisterForm";

import vk1 from "../../assets/images/vk1.png"
import vk2 from "../../assets/images/vk2.png"
import vk3 from "../../assets/images/vk3.png"

const Dashboard = ({isAuth, register}) => {
  useEffect(() => {
    document.title = "Dashboard"
  }, [])

  const handleLoginSubmit = fields => {
    register(fields)
  }

  if (isAuth) {
    return <Redirect to="/profile"/>
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.welcome}>Welcome</div>
      <div className={classes.mainWrapper}>
        <div className={classes.aboutVk}>
          <b>Vkontakte</b> - is a universal tool for communication and people search,
          <br /> which is used by tens of millions of people every day.
        </div>

        <div className={classes.dsBlock}>
          <div className={classes.dsBlockHeader}>Instant registration</div>
          <RegisterForm onSubmit={handleLoginSubmit}/>
        </div>

        <div className={classes.dsBlock}>
          <div className={classes.dsBlockHeader}>What will VKontakte help with?</div>
          <div>
            <ul className={classes.list}>
              <li>To find people, with whom you have ever studied, worked or relaxed.</li>
              <li>To learn more about the people, around you, and find new friends.</li>
              <li>Always stay in touch with those, who are dear to you.</li>
            </ul>
            <div className={classes.images}>
              <img src={vk1} alt="vk1"/>
              <img src={vk2} alt="vk2"/>
              <img src={vk3} alt="vk3"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    isAuth: state.auth.isAuth
  }
}

export default connect(mapStateToProps, {setOnline, register})(Dashboard);
