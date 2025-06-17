import type { ReactNode } from 'react'
import type { ThemeComponent, NotificationProps } from '../ThemeInterface'
import styles from './Notification.module.css'

const Notification: ThemeComponent = {
  render: (props: NotificationProps): ReactNode => {
    const { notification, getUserType } = props
    
    return (
      <div className={`${styles.notification} ${styles[getUserType(notification.badges || [])]}`}>
        <div className={styles.notificationContent}>
          {notification.text}
        </div>
      </div>
    )
  },
  styles: ''
}

export default Notification 