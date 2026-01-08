import './POIInfo.css'

export function POIInfo({ label, text, visible }) {
  return (
    <div className={`poi-info ${visible ? 'poi-info--visible' : 'poi-info--hidden'}`}>
      <div className="poi-info__content">
        <h2 className="poi-info__title">{label}</h2>
        <p className="poi-info__text">{text}</p>
      </div>
    </div>
  )
}
