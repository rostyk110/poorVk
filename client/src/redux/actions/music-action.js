import {GET_CHART, HANDLE_IS_PAYING, SET_CURRENT_TRACK, SET_VOLUME, SHUFFLE_ALL} from "../types";
import {musicAPI} from "../../api/api";

export const getChart = () => async dispatch => {
  try {
    const res = await musicAPI.getChart()

    dispatch({
      type: GET_CHART,
      payload: res.data.data
    })

  } catch (e) {
    console.log(e)
  }
}

export const findMusic = inputValue => async dispatch => {
  try {
    const res = await musicAPI.findMusic(inputValue)

    dispatch({
      type: GET_CHART,
      payload: res.data.data
    })

  } catch (e) {
    console.log(e)
  }
}

export const setCurrentTrack = track => {
  return {
    type: SET_CURRENT_TRACK,
    payload: track
  }
}

export const setVolume = volume => {
  return {
    type: SET_VOLUME,
    payload: volume
  }
}

export const handleIsPlaying = isPlaying => {
  return {
    type: HANDLE_IS_PAYING,
    payload: isPlaying
  }
}

export const shuffleAll = () => {
  return {
    type: SHUFFLE_ALL
  }
}
