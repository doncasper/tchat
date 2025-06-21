import type { ReactNode } from 'react'
import type { ThemeComponent, NotificationProps } from '../ThemeInterface'
import { useUIStore } from '../../store/uiStore'
import styles from './Notification.module.css'

const Notification: ThemeComponent = {
  render: (props: NotificationProps): ReactNode => {
    const { notification, getUserType } = props
    const { compactMode, fontSize } = useUIStore()
    
    return (
      <div className={`${styles.notification} ${styles[getUserType(notification.badges || [])]} ${styles[fontSize]} ${compactMode ? styles.compact : ''}`}>
        <div className={styles.notificationContent}>
          {notification.text}
        </div>
      </div>
    )
  },
  styles: ''
}

export default Notification 