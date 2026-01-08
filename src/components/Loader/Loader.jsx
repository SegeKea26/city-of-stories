import './Loader.css'

export const Loader = ({ progress, isLoading }) => {
  if (!isLoading && progress === 100) return null

  return (
    <div className={`loader ${!isLoading ? 'loader--hidden' : ''}`}>
      <div className="loader__bar">
        <div className="loader__bar-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="loader__text">{Math.round(progress)}%</p>
    </div>
  )
}
