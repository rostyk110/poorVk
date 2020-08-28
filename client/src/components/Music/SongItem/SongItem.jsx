import React from 'react';
import classes from './SongItem.module.css'
import {cutMessage, toSeconds} from "../../../utils/utils-funcs";
import {audioPlayerControls} from "../../../utils/musicGeneral";

export const SongItem = ({track, volume, audio, setCurrentTrack, handleIsPlaying}) => {
  const playerControls = audioPlayerControls(audio, null, volume, track, null, handleIsPlaying)

  const changeTrack = () => {
    setCurrentTrack(track)
    playerControls.setPlaying()
  }

  return (
    <div className={classes.songWrapper} onClick={changeTrack}>
      <div className={classes.leftSide}>
        <div className={classes.imageBlock}>
          <img src={track.album.cover_small} alt="album"/>
        </div>
        <div>
          <div className={classes.title}>{cutMessage(track.title, 59)}</div>
          <div className={classes.artist}>{track.artist.name}</div>
        </div>
      </div>
      <div className={classes.rightSide}>{toSeconds(track.duration)}</div>
    </div>
  )
}

