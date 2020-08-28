export const audioPlayerControls = (audio, music, volume, currentTrack, setCurrentTrack, handleIsPlaying) => {
  const currentAudioIndex = music ? music.findIndex(m => m.id === currentTrack.id) : null

  return {
    setPlaying: () => {
      handleIsPlaying(true)
      audio.src = currentTrack.preview
      audio.load();
      audio.volume = volume
      audio.play()
    },
    setPause: () => {
      handleIsPlaying(false)
      audio.pause()
    },
    nextMusic: () => {
      if (currentAudioIndex < music.length - 1) {
        setCurrentTrack(music[currentAudioIndex + 1])
        audio.src = music[currentAudioIndex + 1].preview
      } else {
        setCurrentTrack(music[0])
        audio.src = music[0].preview
      }
      audio.load();
      audio.play();
      handleIsPlaying(true)
    },
    previousMusic: () => {
      if (currentAudioIndex === 0) {
        setCurrentTrack(music[music.length - 1])
        audio.src = music[music.length - 1].preview
      } else {
        setCurrentTrack(music[currentAudioIndex - 1])
        audio.src = music[currentAudioIndex - 1].preview
      }
      audio.load();
      audio.play();
      handleIsPlaying(true)
    }
  }
}


// export const nextMusic = (audio, music, setCurrentTrack, handleIsPlaying, currentTrack) => {
//   const currentAudioIndex = music.findIndex(m => m.id === currentTrack.id)
//
//   if (currentAudioIndex < music.length - 1) {
//     setCurrentTrack(music[currentAudioIndex + 1])
//     audio.src = music[currentAudioIndex + 1].preview
//   } else {
//     setCurrentTrack(music[0])
//     audio.src = music[0].preview
//   }
//   audio.load();
//   audio.play();
//   handleIsPlaying(true)
// }

// export const previousMusic = (audio, music, setCurrentTrack, handleIsPlaying, currentTrack) => {
//   const currentAudioIndex = music.findIndex(m => m.id === currentTrack.id)
//
//   if (currentAudioIndex === 0) {
//     setCurrentTrack(music[music.length - 1])
//     audio.src = music[music.length - 1].preview
//   } else {
//     setCurrentTrack(music[currentAudioIndex - 1])
//     audio.src = music[currentAudioIndex - 1].preview
//   }
//   audio.load();
//   audio.play();
//   handleIsPlaying(true)
// }

// export const setPlaying = (handleIsPlaying, audio, currentTrack, volume) => {
//   handleIsPlaying(true)
//   audio.src = currentTrack.preview
//   audio.load();
//   audio.volume = volume
//   audio.play()
// }

// export const setPause = (handleIsPlaying, audio) => {
//   handleIsPlaying(false)
//   audio.pause()
// }
