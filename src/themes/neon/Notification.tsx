import type { ReactNode } from 'react'
import type { ThemeComponent, NotificationProps } from '../ThemeInterface'
import { useUIStore } from '../../store/uiStore'
import styles from './Notification.module.css'

const Notification: ThemeComponent = {
  render: (props: NotificationProps): ReactNode => {
    const { notification, getBadgeText, getUserType } = props
    const { showTimestamps, showBadges, compactMode, fontSize } = useUIStore()
    
    return (
      <div className={`${styles.notification} ${styles[fontSize]} ${compactMode ? styles.compact : ''} neon-notification`}>
        <div className={styles.notificationHeader}>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{notification.nickname}</span>
            {showBadges && (
              <div className={styles.badges}>
                {notification.badges?.map((badge: string, index: number) => (
                  <span key={index} className={`${styles.badge} ${styles[badge] || badge}`} title={badge}>
                    {getBadgeText(badge)}
                  </span>
                ))}
              </div>
            )}
            {notification.count && (
              <span className={styles.notificationCount}>({notification.count})</span>
            )}
          </div>
          {showTimestamps && (
            <span className={styles.notificationTime}>
              {notification.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>
          )}
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