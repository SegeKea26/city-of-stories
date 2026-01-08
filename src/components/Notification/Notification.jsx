import './Notification.css'

export function Notification({ visible, message }) {
  return (
    <div className={`notification ${visible ? 'notification--visible' : 'notification--hidden'}`}>
      <p className="notification__message">{message}</p>
    </div>
  )
}
