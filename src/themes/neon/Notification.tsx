import type { ReactNode } from 'react'
import type { ThemeComponent } from '../ThemeInterface'
import type { ChatDataItem } from '../../types/ChatTypes'
import styles from './Notification.module.css'

interface NotificationProps {
  notification: ChatDataItem
  getBadgeText: (badge: string) => string
}

const Notification: ThemeComponent = {
  render: (props: NotificationProps): ReactNode => {
    const { notification, getBadgeText } = props
    
    return (
      <div className={styles.notification}>
        <div className={styles.notificationHeader}>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{notification.author}</span>
            <div className={styles.badges}>
              {notification.badges?.map((badge: string, index: number) => (
                <span key={index} className={`${styles.badge} ${styles[badge] || badge}`} title={badge}>
                  {getBadgeText(badge)}
                </span>
              ))}
            </div>
            {notification.count && (
              <span className={styles.notificationCount}>({notification.count})</span>
            )}
          </div>
          <span className={styles.notificationTime}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </span>
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