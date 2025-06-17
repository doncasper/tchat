import type { ReactNode } from 'react'
import type { ThemeComponent, NotificationProps } from '../ThemeInterface'
import styles from './Notification.module.css'



const Notification: ThemeComponent = {
  render: (props: NotificationProps): ReactNode => {
    const { notification } = props
    
    return (
      <div className={styles.notification}>
        <div className={styles.notificationHeader}>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{notification.author}</span>
            {notification.count && (
              <span className={styles.notificationCount}>({notification.count})</span>
            )}
          </div>
        </div>
        <div className={styles.notificationContent}>
          {notification.text}
        </div>
      </div>
    )
  },
  styles: ''
}

export default Notification 