import React, {useEffect, useState} from 'react';
import {withAuthRedirect} from "../hoc/WithAuthRedirect/withAuthRedirect";
import {compose} from "redux";
import {connect} from "react-redux";
import {Player} from "./Player/Player";
import classes from './Music.module.css'
import {SongItem} from "./SongItem/SongItem";
import {
  findMusic,
  getChart,
  handleIsPlaying,
  setCurrentTrack,
  setVolume,
  shuffleAll
} from "../../redux/actions/music-action";
import Loader from "../UI/Loader/Loader";
import {debounce} from 'lodash'

import shuffleSvg from "../../assets/images/musicPlayer/shuffle.svg"

const Music = props => {
  const [musicToFind, setMusicToFind] = useState('')

  useEffect(() => {
    document.title = "Music"
    // props.getChart()
  }, [])

  useEffect(() => {
    if (musicToFind) {
      props.findMusic(musicToFind)
    }
  }, [musicToFind])

  const onInputThrottled = debounce(value => setMusicToFind(value), 200)

  if (props.loading) {
    return <Loader/>
  }

  return (
    <div>
      <Player music={props.tracks} currentTrack={props.currentTrack} setCurrentTrack={props.setCurrentTrack}
              audio={props.audioTag} isPlaying={props.isPlaying} handleIsPlaying={props.handleIsPlaying}
              volume={props.volume} setVolume={props.setVolume}/>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <div className={classes.headerItem}>My music</div>
        </div>
        <div className={classes.mainWrapper}>
          <div className={classes.inputBlock}>
            <input type="text" placeholder="Search music" onChange={e => onInputThrottled(e.target.value)}/>
            <button>Search</button>
          </div>
          <div className={classes.playList}>
            <div className={classes.playListLeft}>
              <div className={classes.playListHeader}>
                <div>Music</div>
                <div className={classes.chooseShuffle}>by default</div>
              </div>
              <div className={classes.shuffleAll} onClick={() => props.shuffleAll()}>
                <img className={classes.shuffleSvg} src={shuffleSvg} alt="shuffleSvg"/>
                Shuffle all
              </div>
              <div>
                {props.tracks.map(track => {
                  return <SongItem track={track} setCurrentTrack={props.setCurrentTrack} audio={props.audioTag}
                                   handleIsPlaying={props.handleIsPlaying} volume={props.volume}/>
                })}
              </div>
            </div>
            <div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  isAuth: state.auth.isAuth,
  loading: state.musicPage.loading,
  currentTrack: state.musicPage.currentTrack,
  audioTag: state.musicPage.audioTag,
  volume: state.musicPage.volume,
  isPlaying: state.musicPage.isPlaying,
  tracks: state.musicPage.tracks
})

export default compose(
  connect(mapStateToProps, {getChart, findMusic, setCurrentTrack, setVolume, shuffleAll, handleIsPlaying}),
  withAuthRedirect
)(Music)

