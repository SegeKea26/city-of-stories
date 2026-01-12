import { useEffect, useRef } from 'react'

export const useWindSound = (isFollowingCart) => {
  const windAudioRef = useRef(null)

  useEffect(() => {
    if (!windAudioRef.current) {
      windAudioRef.current = new Audio('/sounds/wind-sound.mp3')
      windAudioRef.current.loop = true
      windAudioRef.current.volume = 0.5
    }

    const windAudio = windAudioRef.current

    if (isFollowingCart) {
      const playAudio = async () => {
        try {
          await windAudio.play()
        } catch (error) {
          console.log('Wind sound autoplay was prevented', error)
        }
      }
      playAudio()
    } else {
      windAudio.pause()
      windAudio.currentTime = 0
    }

    return () => {
      if (windAudio) {
        windAudio.pause()
        windAudio.currentTime = 0
      }
    }
  }, [isFollowingCart])
}
