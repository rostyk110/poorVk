import React from 'react';
import classes from "../MyPosts/MyPosts.module.css"
import {NavLink} from "react-router-dom";

const Friends = props => {
  const {following} = props

  return (
    <div className={classes.friendsWrapper}>
      <div>Following <span>{following.length}</span></div>
      <div className={classes.listFollowing}>
        {following && following.slice(0, 6).map((user, index) => {
          return (
            <NavLink key={index} to={"/profile/" + user._id}>
              <div className={classes.followingUser}>
                <img src={user.avatar} alt=""/>
                <span>{user.fullName.split(' ')[0]}</span>
              </div>
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

export default Friends;
