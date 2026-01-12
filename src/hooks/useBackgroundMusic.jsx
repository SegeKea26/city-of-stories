import { useEffect } from 'react'

export const useBackgroundMusic = () => {
  useEffect(() => {
    const audio = new Audio('/sounds/Late-Christmas-Night_Lo-Fi-Beats.mp3')
    audio.loop = true
    audio.volume = 0.1 
    
    const playAudio = async () => {
      try {
        await audio.play()
      } catch (error) {
        console.log('Audio autoplay was prevented. User interaction may be required.', error)
        const playOnInteraction = async () => {
          try {
            await audio.play()
            document.removeEventListener('click', playOnInteraction)
          } catch (err) {
            console.log('Failed to play audio on interaction', err)
          }
        }
        document.addEventListener('click', playOnInteraction)
      }
    }

    playAudio()

    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])
}
