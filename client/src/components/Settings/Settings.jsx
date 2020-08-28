import React, {useEffect, useState} from 'react';
import {withAuthRedirect} from "../hoc/WithAuthRedirect/withAuthRedirect";
import {compose} from "redux";
import {connect} from "react-redux";

import classes from './Settings.module.css'

const Settings = ({isAuth}) => {
  const [active, setActive] = useState(0)
  const menuItems = ['General', 'Security', 'Privacy', 'Notifications', 'Blocked', 'App settings']

  useEffect(() => {
    document.title = "Settings"
  }, [])

  return (
    <div className={classes.wrapper}>
      <div className={classes.mainBlock}>
        <div className={classes.header}>
          General
        </div>
        <div className={classes.main}>
          <div className={classes.item}>
            <div className={classes.title}>Menu settings</div>
            <div className={classes.settingsSetUp}>Set up menu items</div>
          </div>
          <div className={classes.item}>
            <div className={classes.title}>Profile settings</div>
            <div className={classes.settingsCheckboxes}>
              <div>
                <input type="checkbox"/> Show only my posts on my page by default
              </div>
              <div>
                <input type="checkbox"/> Disable wall comments
              </div>
              <div>
                <input type="checkbox"/> Accessibility features
              </div>
            </div>
          </div>
          <div className={classes.item}>
            <div className={classes.title}>Password</div>
            <div className={classes.settings}>
              <div>updated 24 days ago</div>
              <div className={classes.change}>Change</div>
            </div>
          </div>
          <div className={classes.item}>
            <div className={classes.title}>Email</div>
            <div className={classes.settings}>
              <div>ro***@gmail.com</div>
              <div className={classes.change}>Change</div>
            </div>
          </div>
          <div className={classes.item}>
            <div className={classes.title}>Phone number</div>
            <div className={classes.settings}>
              <div>+380 ** *** ** 28</div>
              <div className={classes.change}>Change</div>
            </div>
          </div>
          <div className={classes.item}>
            <div className={classes.title}>Profile URL</div>
            <div className={classes.settings}>
              <div>https://vk.com/rostyslav_vendysh</div>
              <div className={classes.change}>Change</div>
            </div>
          </div>
          <div className={classes.item}>
            <div className={classes.title}>Language</div>
            <div className={classes.settings}>
              <div>English</div>
              <div className={classes.change}>Change</div>
            </div>
          </div>
        </div>
        <div className={classes.footer}>
          You can delete your account <span className={classes.delete}>here.</span>
        </div>
      </div>
      <div className={classes.rightBlock}>
        {
          menuItems.map((item, index) => {
            return <div className={classes.menuItem + ' ' + (active === index && classes.active)}
            onClick={() => setActive(index)}>
              {item}
            </div>
          })
        }
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  isAuth: state.auth.isAuth
})

export default compose(
  connect(mapStateToProps),
  withAuthRedirect
)(Settings)

