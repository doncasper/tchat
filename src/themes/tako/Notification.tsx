import type { ReactNode } from 'react'
import type { ThemeComponent, NotificationProps } from '../ThemeInterface'
import { useUIStore } from '../../store/uiStore'
import styles from './Notification.module.css'

const NotificationComponent = (props: NotificationProps): ReactNode => {
  const { notification } = props
  const { fontSizeMultiplier } = useUIStore()
  
  return (
    <div 
      className={styles.notification}
      style={{ fontSize: `${fontSizeMultiplier}em` }}
    >
      <div className={styles.notificationContent}>
        {notification.notificationType === 'sub_gift' && (
          <span className={styles.notificationText}>
            {notification.nickname} gifted {notification.count} subs!
          </span>
        )}
        {notification.notificationType === 'sub' && (
          <span className={styles.notificationText}>
            {notification.nickname} gifted {notification.count} subs!
          </span>
        )}
        {notification.notificationType === 'cheer' && (
          <span className={styles.notificationText}>
            {notification.nickname} gifted {notification.count} subs!
          </span>
        )}
        {notification.notificationType === 'follow' && (
          <span className={styles.notificationText}>
            {notification.nickname} following now!
          </span>
        )}
        {notification.notificationType === 'raid' && (
          <span className={styles.notificationText}>
            {notification.nickname} raided the stream!
          </span>
        )}
        {notification.notificationType === 'bits' && (
          <span className={styles.notificationText}>
            {notification.nickname} gifted {notification.count} bits!
          </span>
        )}
        {notification.notificationType === 'alert' && (
          <span className={styles.notificationText}>
            {notification.text}
          </span>
        )}
      </div>
    </div>
  )
}

const Notification: ThemeComponent = {
  render: NotificationComponent,
  styles: ''
}

export default Notification 