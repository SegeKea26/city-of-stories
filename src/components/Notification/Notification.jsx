import './Notification.css'

export function Notification({ visible, cameraMode, type = 'camera', onDismiss }) {
  const getMessage = () => {
    if (type === 'wheel') {
      return 'Drag around to look, press <strong>V</strong> to toggle between viewer modes'
    }
    return `Press <strong>V</strong> to switch camera mode (${cameraMode === 'grab' ? 'Viewer Mode' : 'Grab Mode'})`
  }

  return (
    <div 
      className={`notification ${visible ? 'notification--visible' : 'notification--hidden'}`}
      onClick={onDismiss}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onDismiss()
        }
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: getMessage() }} />
    </div>
  )
}
