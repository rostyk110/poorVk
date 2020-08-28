import React, {useEffect, useState} from 'react';
import classes from './Player.module.css'

import nextSvg from '../../../assets/images/musicPlayer/next.svg'
import pauseSvg from '../../../assets/images/musicPlayer/pause.svg'
import playSvg from '../../../assets/images/musicPlayer/play.svg'
import previousSvg from '../../../assets/images/musicPlayer/previous.svg'
import repeatSvg from '../../../assets/images/musicPlayer/repeat.svg'
import repeatOnSvg from '../../../assets/images/musicPlayer/repeatOn.svg'
import shuffleSvg from '../../../assets/images/musicPlayer/shuffle-arrows.svg'
import shuffleOnSvg from '../../../assets/images/musicPlayer/shuffle-arrowsOn.svg'
import volumeUpSvg from '../../../assets/images/musicPlayer/volume-up.svg'
import volumeDownSvg from '../../../assets/images/musicPlayer/volume-down.svg'
import {cutMessage, toSeconds} from "../../../utils/utils-funcs";
import {audioPlayerControls} from "../../../utils/musicGeneral";

export const Player = ({music, currentTrack, setCurrentTrack, handleIsPlaying, isPlaying, audio, setVolume, volume}) => {
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [time, setTime] = useState(0);
  const [seekSliderValue, setSeekSliderValue] = useState(0)
  const [sliderValue, setSliderValue] = useState(0)

  const playerControls = audioPlayerControls(audio, music, volume, currentTrack, setCurrentTrack, handleIsPlaying)

  useEffect(() => {
    audio.addEventListener('timeupdate', setCurrentTime)
    return () => {
      audio.removeEventListener('timeupdate', setCurrentTime)
    };
  }, [currentTrack]);

  useEffect(() => {
      audio.loop = repeat
    },
    [repeat]
  );

  useEffect(() => {
      audio.volume = volume
    },
    [volume]
  );

  useEffect(() => {
      if (seekSliderValue) {
        audio.currentTime = audio.duration * (seekSliderValue / 100)
      }
    },
    [seekSliderValue]
  );

  const setCurrentTime = () => {
    setTime(audio.currentTime)
    setSliderValue(audio.currentTime / audio.duration * 100)
  }

  const seek = () => {
    if (seekSliderValue) {
      audio.currentTime = audio.duration * (seekSliderValue / 100)
    }
  }

  const onMouseMoveHandler = e => {
    if (e.buttons === 1) {
      seek()
    }
  }

  const onInputHandler = e => setSeekSliderValue(e.target.value)
  const volumeUp = () => setVolume(volume + 0.05 < 1 ? Math.round((volume + 0.05) * 100) / 100 : 1)
  const volumeDown = () => setVolume(volume - 0.05 > 0 ? Math.round((volume - 0.05) * 100) / 100 : 0)

  return (
    <div className={classes.playerWrapper}>
      <div className={classes.leftSide}>
        {
          !isPlaying
            ? <div className={classes.btn + ' ' + classes.play} onClick={playerControls.setPlaying}>
              <img src={playSvg} alt="playSvg"/>
            </div>
            : <div className={classes.btn + ' ' + classes.play} onClick={playerControls.setPause}>
              <img src={pauseSvg} alt="pauseSvg"/>
            </div>
        }
        <div className={classes.leftSidePrevNext}>
          <div className={classes.btn} onClick={playerControls.previousMusic}>
            <img src={previousSvg} alt="previousSvg"/>
          </div>
          <div className={classes.btn} onClick={playerControls.nextMusic}>
            <img src={nextSvg} alt="nextSvg"/>
          </div>
        </div>
      </div>
      <div className={classes.middleSide}>
        <div className={classes.musicImage}>
          <img src={currentTrack.album.cover_small} alt="album"/>
        </div>
        <div className={classes.mainPlayer}>
          <div className={classes.musicInfo}>
            <div className={classes.title}>{cutMessage(currentTrack.title, 45)}</div>
            <div className={classes.musicInfoNameTime}>
              <div className={classes.artist}>{currentTrack.artist.name}</div>
              <div className={classes.musicInfoTime}>{toSeconds(Math.round(time))}</div>

            </div>
          </div>
          <div className={classes.seekMusicSliderWrapper}>
            <input className={classes.seekMusicSlider} type="range" min="0" max="100" value={sliderValue} step="1"
                   onMouseDown={seek} onMouseMove={onMouseMoveHandler}
                   onChange={onInputHandler}/>
          </div>
        </div>
      </div>
      <div className={classes.volumeSide}>
        <div className={classes.volumeBtns}>
          <div className={classes.btn} onClick={volumeUp}>
            <img src={volumeUpSvg} alt="volumeUpSvg"/>
          </div>
          <div className={classes.btn} onClick={volumeDown}>
            <img src={volumeDownSvg} alt="volumeDownSvg"/>
          </div>
        </div>
        <div className={classes.musicInfoTime}>{Math.round(volume * 100)}%</div>
      </div>
      <div className={classes.rightSide}>
        <div className={classes.btn + ' ' + classes.shuffle}>
          <img src={!shuffle ? shuffleSvg : shuffleOnSvg} alt="shuffleSvg" onClick={() => setShuffle(!shuffle)}/>
        </div>
        <div className={classes.btn}>
          <img src={!repeat ? repeatSvg : repeatOnSvg} alt="repeatSvg" onClick={() => setRepeat(!repeat)}/>
        </div>
      </div>
    </div>
  )
}




