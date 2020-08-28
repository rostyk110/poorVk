import {GET_CHART, SET_CURRENT_TRACK, HANDLE_IS_PAYING, SET_VOLUME, SHUFFLE_ALL} from "../types";

const initialState = {
  audioTag: new Audio(),
  tracks: [],
  currentTrack: {
    id: 780622512,
    title: 'Rise Up',
    duration: 169,
    preview: 'https://cdns-preview-4.dzcdn.net/stream/c-4808f90a1125203a5b261fd20647b300-6.mp3',
    artist: {
      name: 'TheFatRat',
    },
    album: {
      cover_small: 'https://e-cdns-images.dzcdn.net/images/cover/f808bd6d0eda59c2fbf354b23a7612bc/56x56-000000-80-0-0.jpg',
    }
  },
  isPlaying: false,
  volume: 0.05,
  loading: true
}

const musicReducer = (state = initialState, action) => {
  const {type, payload} = action
  switch (type) {
    case GET_CHART:
      return {
        ...state,
        tracks: payload,
        loading: false
      }
    case SET_CURRENT_TRACK:
      return {
        ...state,
        currentTrack: payload
      }
    case HANDLE_IS_PAYING:
      return {
        ...state,
        isPlaying: payload
      }
    case SET_VOLUME:
      return {
        ...state,
        volume: payload
      }
    case SHUFFLE_ALL:
      return {
        ...state,
        tracks: [...state.tracks.sort(() => Math.random() - 0.5)]
      }
    default:
      return state
  }
}

export default musicReducer
