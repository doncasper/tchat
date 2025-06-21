import type { ReactNode } from 'react'
import type { ThemeComponent, MessageProps } from '../ThemeInterface'
import { useUIStore } from '../../store/uiStore'
import styles from './Message.module.css'

const Message: ThemeComponent = {
  render: (props: MessageProps): ReactNode => {
    const { message, getBadgeText } = props
    const { showTimestamps, showBadges, compactMode, fontSize } = useUIStore()
    
    return (
      <div className={`${styles.message} ${styles[message.userType || '']} ${styles[fontSize]} ${compactMode ? styles.compact : ''}`}>
        <div className={styles.messageHeader}>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{message.nickname}</span>
            {showBadges && (
              <div className={styles.badges}>
                {message.badges?.map((badge: string, index: number) => (
                  <span key={index} className={`${styles.badge} ${styles[badge]}`} title={badge}>
                    {getBadgeText(badge)}
                  </span>
                ))}
              </div>
            )}
          </div>
          {showTimestamps && (
            <span className={styles.messageTime}>
              {message.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </span>
          )}
        </div>
        <div className={styles.messageContent}>
          {message.text}
        </div>
      </div>
    )
  },
  styles: ''
}

export default Message 