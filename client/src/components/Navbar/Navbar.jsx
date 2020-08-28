import React from 'react';
import {NavLink} from "react-router-dom";
import classes from './Navbar.module.css'
import {connect} from "react-redux";
import {countUnreadMessages} from "../../utils/utils-funcs";

import homeSvg from '../../assets/images/navbar/browser.svg'
import chatSvg from '../../assets/images/navbar/chat.svg'
import settingsSvg from '../../assets/images/navbar/gear.svg'
import musicSvg from '../../assets/images/navbar/music.svg'
import newsSvg from '../../assets/images/navbar/news.svg'
import userSvg from '../../assets/images/navbar/user.svg'

const Navbar = ({dialogs, userId, isBurgerClicked}) => {
  const unreadMessages = countUnreadMessages(dialogs, userId)

  return (
    <nav className={classes.nav + " " + (isBurgerClicked ? classes.showNavBar : '')}>
      <div className={classes.item}>
        <i><img src={homeSvg} alt="homeSvg"/></i>
        <NavLink to="/profile" activeClassName={classes.active}>My profile</NavLink>
      </div>
      <div className={classes.item}>
        <i><img src={chatSvg} alt="chatSvg"/></i>
        <NavLink to="/dialogs" activeClassName={classes.active}>Messages</NavLink>
        {unreadMessages
          ? <span className={classes.unreadMessages}>{unreadMessages}</span>
          : null
        }
      </div>
      <div className={classes.item}>
        <i><img src={newsSvg} alt="newsSvg"/></i>
        <NavLink to="/news" activeClassName={classes.active}>News</NavLink>
      </div>
      <div className={classes.item}>
        <i><img src={musicSvg} alt="musicSvg"/></i>
        <NavLink to="/music" activeClassName={classes.active}>Music</NavLink>
      </div>
      <div className={classes.item}>
        <i><img src={userSvg} alt="userSvg"/></i>
        <NavLink to="/users" activeClassName={classes.active}>Find users</NavLink>
      </div>
      <div className={classes.item}>
        <i><img src={settingsSvg} alt="settingsSvg"/></i>
        <NavLink to="/settings" activeClassName={classes.active}>Settings</NavLink>
      </div>
    </nav>
  );
}

const mapStateToProps = state => {
  return {
    isBurgerClicked: state.sideBar.isBurgerClicked,
    dialogs: state.dialogsPage.dialogs,
    userId: state.auth.userId
  }
}

export default connect(mapStateToProps, null)(Navbar);
