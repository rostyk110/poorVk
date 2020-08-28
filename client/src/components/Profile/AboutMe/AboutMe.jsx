import React from 'react';
import {formatDate} from "../../../utils/utils-funcs";
import Description from "./Description/Description";
import DescriptionForm from "./Description/DescriptionForm";
import classes from "./AboutMe.module.css"
import Status from "./Status/Status";

const AboutMe = props => {
  const {userProfile, authedUserId, status, isEditMode} = props
  const {updateUserStatus, updateUserProfile, setIsEditMode} = props

  const isMyProfile = authedUserId === userProfile.user._id

  const handleLoginSubmit = profile => {
    updateUserProfile(profile)
      .then(() => setIsEditMode(false))
  }

  return (
    <div className={classes.aboutMe}>
      <div className={classes.description}>
        <div className={classes.topUserInfo}>
          <div className={classes.userIsOnline}>
            <div className={classes.userName}>
              {userProfile.user.fullName}
            </div>
            {userProfile.user.online
              ? <span className={classes.status}>online</span>
              : <span className={classes.status}>last seen {formatDate(userProfile.user.date)}</span>
            }
          </div>

          <Status status={status} updateUserStatus={updateUserStatus} isMyProfile={isMyProfile}/>
        </div>
        {
          !isEditMode
            ? <Description user={userProfile}/>
            : <DescriptionForm onSubmit={handleLoginSubmit} user={userProfile}
                                      initialValues={{...userProfile, fullName: userProfile.user.fullName}}/>
        }
      </div>
    </div>
  )
}

export default AboutMe;
