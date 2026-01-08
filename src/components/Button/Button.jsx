import './Button.css'

export function Button({ onClick, visible, label = "Back" }) {
  return (
    <button 
      className={`button ${visible ? 'button--visible' : 'button--hidden'}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
