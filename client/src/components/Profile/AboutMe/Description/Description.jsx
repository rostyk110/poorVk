import React from "react";
import {cutMessage} from "../../../../utils/utils-funcs";
import classes from "./Description.module.css"

const Description = ({user}) => {
  return (
    <>
      <div className={classes.descBlock}>
        <div className={classes.descItem}>
          <div className={classes.descTitle}>About me:</div>
          <div className={classes.descValue}>{user.aboutMe}</div>
        </div>
        <div className={classes.descItem}>
          <div className={classes.descTitle}>Looking for a job:</div>
          <div className={classes.descValue}>{user.lookingForAJob ? 'yes' : 'no'}</div>
        </div>
        <div className={classes.descItem}>
          <div className={classes.descTitle}>Professional skills:</div>
          <div className={classes.descValue}>{user.lookingForAJobDescription}</div>
        </div>
      </div>

      <div className={classes.descBlock}>
        <div className={classes.descBlockLabel}>Contacts:</div>
        {
          Object.keys(user.contacts).map((key, index) => {
            if (!user.contacts[key]) return null

            return <div key={index} className={classes.descItem}>
              <div className={classes.descTitle}>{key}:</div>
              <div className={classes.descValue}>
                <a href={user.contacts[key]} target="_blank"
                   rel="noopener noreferrer">{cutMessage(user.contacts[key], 53)}</a>
              </div>
            </div>
          })
        }
      </div>
    </>
  )
}

export default Description;
