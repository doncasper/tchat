import type { ReactNode } from 'react'
import type { ThemeComponent, NotificationProps } from '../ThemeInterface'
import { useUIStore } from '../../store/uiStore'
import styles from './Notification.module.css'
import animations from './animations.module.css'
import loveImage from '../../../public/themes/tako/love.png'

const Notification: ThemeComponent = {
  render: (props: NotificationProps): ReactNode => {
    const { notification } = props
    const { compactMode, fontSize } = useUIStore()
    
    return (
      <div className={`${styles.notification} ${styles[fontSize]} ${compactMode ? styles.compact : ''} ${animations.takoNotification}`}>
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
  },
  styles: ''
}

export default Notification 