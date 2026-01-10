import './POIInfo.css'

export function POIInfo({ label, text, visible, buttonLabel, onButtonClick, image1, image2, buttons, buttonsDisabled }) {
  return (
    <div className={`poi-info ${visible ? 'poi-info--visible' : 'poi-info--hidden'}`}>
      <div className="poi-info__content">
        <h2 className="poi-info__title">{label || 'POI'}</h2>
        <p className="poi-info__text">{text || 'Select a point of interest to learn more.'}</p>
        {(image1 || image2) && (
          <div className="poi-info__images">
            {image1 && <img src={image1} alt="POI Image 1" className="poi-info__image" />}
            {image2 && <img src={image2} alt="POI Image 2" className="poi-info__image" />}
          </div>
        )}
        {buttons && buttons.length > 0 ? (
          <div className="poi-info__buttons">
            {buttons.map((btn, index) => (
              <button 
                key={index}
                className="poi-info__button"
                onClick={btn.onClick}
                disabled={buttonsDisabled}
              >
                {btn.label}
              </button>
            ))}
          </div>
        ) : buttonLabel && onButtonClick && (
          <button 
            className="poi-info__button"
            onClick={onButtonClick}
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  )
}
