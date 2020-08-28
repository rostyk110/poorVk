import React from 'react';
import classes from './UserInfo.module.css'
import avatar from '../../../assets/images/avatar.png'
import {NavLink} from "react-router-dom";

const UserInfo = ({isInFollowingProgress, user, followUser, unfollowUser}) => {
  const isDisabled = isInFollowingProgress.includes(user.id)

  return (
    <div className={classes.userInfo}>
      <div className={classes.leftBarInfo}>
        <div className={classes.userPhotoWrapper}>
          <NavLink to={'/profile/' + user.id}>
            <img alt="rofl" src={user.avatar || avatar} className={classes.userPhoto}/>
          </NavLink>
        </div>
        <div className={classes.userInfoBlock}>
          <div className={classes.infoBlock}>
            <NavLink to={'/profile/' + user.id}>
              <div className={classes.name}> {user.fullName}</div>
            </NavLink>
            <div>{user.status}</div>
          </div>
          <div className={classes.city}>{'Kyiv'}</div>
        </div>
      </div>

      <div className={classes.rightBarInfo}>
        {
          user.followed !== null && <div>
            {user.followed
              ? <button disabled={isDisabled} className={classes.btn} onClick={() => {
                unfollowUser(user.id)
              }}>Unfollow</button>
              : <button disabled={isDisabled} className={classes.btn} onClick={() => {
                followUser(user.id)
              }}>Follow</button>
            }
          </div>
        }
      </div>
    </div>
  )
}

export default UserInfo;
