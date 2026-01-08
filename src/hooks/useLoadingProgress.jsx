import { useState, useEffect } from 'react'

export const useLoadingProgress = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)

  const handleModelLoaded = () => {
    setLoadProgress(100)
    setTimeout(() => {
      setIsLoading(false)
    }, 300)
  }

  useEffect(() => {
    if (!isLoading || loadProgress === 100) return

    let currentProgress = loadProgress === 0 ? 5 : loadProgress
    const interval = setInterval(() => {
      currentProgress += Math.random() * 12
      if (currentProgress > 85) {
        currentProgress = 85
        clearInterval(interval)
      }
      setLoadProgress(Math.round(currentProgress))
    }, 600)

    return () => clearInterval(interval)
  }, [isLoading, loadProgress])

  return {
    isLoading,
    loadProgress,
    handleModelLoaded
  }
}
