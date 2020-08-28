import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {compose} from "redux";
import {NavLink, withRouter} from "react-router-dom";
import {logout} from "../../redux/actions/auth-action";
import {handleBurger} from "../../redux/actions/sidebar-action";
import {cutMessage, getFirstName} from "../../utils/utils-funcs";
import {handleIsPlaying, setCurrentTrack} from "../../redux/actions/music-action";
import {audioPlayerControls} from "../../utils/musicGeneral";

import SearchIcon from "../../assets/images/search_icon.png"
import AddMenu from "../../assets/images/Shape_1.png"
import Logo from "../../assets/images/logo.png"
import previousSvg from "../../assets/images/musicPlayer/previousHeader.svg"
import nextSvg from "../../assets/images/musicPlayer/nextHeader.svg"
import pauseSvg from "../../assets/images/musicPlayer/pauseHeader.svg"
import classes from './Header.module.css'
import playSvg from "../../assets/images/musicPlayer/playHeader.svg"

const Header = ({isAuth, history, fullName, userId, logout, avatar, socket, dialogsPage, currentTrack, isPlaying, handleIsPlaying, audio, music, setCurrentTrack, volume, handleBurger}) => {
  const playerControls = audioPlayerControls(audio, music, volume, currentTrack, setCurrentTrack, handleIsPlaying)
  const musicTitle = currentTrack.artist.name + ' — ' + currentTrack.title

  useEffect(() => {
    audio.addEventListener('ended', playerControls.nextMusic);
    return () => {
      audio.removeEventListener('ended', playerControls.nextMusic);
    };
  }, [currentTrack]);

  const handleLogout = () => {
    socket.emit('sign out', userId)
    socket.emit('stop typing', {username: fullName, dialogId: dialogsPage.activeDialogId});
    socket.disconnect()
    logout()
  }

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <div className={classes.leftHeaderBlock}>
          <NavLink to="/">
            <div className={classes.logo} style={{backgroundImage: `url(${Logo})`}}/>
          </NavLink>
          {isAuth && <input className={classes.search} style={{backgroundImage: `url(${SearchIcon})`}} type="text"
                            placeholder='Search'/>}
        </div>

        {isAuth &&
        <div className={classes.player}>
          <div className={classes.buttons}>
            <div className={classes.previousBtn} onClick={playerControls.previousMusic}>
              <img src={previousSvg} alt="previous"/>
            </div>
            {
              !isPlaying
                ? <div className={classes.playBtn} onClick={playerControls.setPlaying}>
                  <img src={playSvg} alt="play"/>
                </div>
                : <div className={classes.playBtn} onClick={playerControls.setPause}>
                  <img src={pauseSvg} alt="pause"/>
                </div>
            }
            <div className={classes.nextBtn} onClick={playerControls.nextMusic}>
              <img src={nextSvg} alt="next"/>
            </div>
          </div>
          <div className={classes.trackName} onClick={() => history.push('/music')}>
            {cutMessage(musicTitle, 30)}
          </div>
        </div>}

        {isAuth && <div className={classes.loginBlockWrapper}>
          <div className={classes.loginBlock}>
            <div>{getFirstName(fullName)}</div>
            <img src={avatar} alt="avatar"/>
            <i className={classes.addMenu} style={{backgroundImage: `url(${AddMenu})`}}/>
            <div className={classes.menuList}>
              <div onClick={handleLogout} className={classes.logout}>Logout</div>
            </div>
          </div>
        </div>
        }
        {/*<div className={classes.burger} onClick={handleBurger}>*/}
        {/*  <div>_</div>*/}
        {/*  <div>_</div>*/}
        {/*  <div>_</div>*/}
        {/*</div>*/}
      </div>
    </header>
  )
}

const mapStateToProps = state => {
  return {
    isAuth: state.auth.isAuth,
    fullName: state.auth.fullName,
    currentTrack: state.musicPage.currentTrack,
    isPlaying: state.musicPage.isPlaying,
    audio: state.musicPage.audioTag,
    music: state.musicPage.tracks,
    volume: state.musicPage.volume,
    userId: state.auth.userId,
    avatar: state.auth.avatar,
    socket: state.auth.socket,
    dialogsPage: state.dialogsPage,
    userProfile: state.profilePage.userProfile
  }
}

export default compose(
  connect(mapStateToProps, {
    logout,
    handleIsPlaying,
    setCurrentTrack,
    handleBurger
  }),
  withRouter
)(Header);

