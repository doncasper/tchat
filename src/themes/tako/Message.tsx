import type { ReactNode } from 'react'
import type { ThemeComponent, MessageProps } from '../ThemeInterface'
import { useUIStore } from '../../store/uiStore'
import styles from './Message.module.css'
import broadcasterImage from './img/chill.png'
import moderatorImage from './img/coffee.png'

const MessageComponent = (props: MessageProps): ReactNode => {
  const { message, getBadgeText } = props
  const { showTimestamps, showBadges, fontSizeMultiplier } = useUIStore()
  
  return (
    <div>
      <div className={`${styles.userTypeLogo} ${styles[message.userType || '']}`}>
        {message.userType === 'moderator' && (
          <img src={moderatorImage} alt="Tako Moderator" />
        )}
        {message.userType === 'broadcaster' && (
          <img src={broadcasterImage} alt="Tako Broadcaster" />
        )}
      </div>
      <span className={styles.authorName} style={{ backgroundColor: message.color }}>{message.nickname}</span>
      <div 
        className={`${styles.message} ${styles[message.userType || '']}`}
        style={{ fontSize: `${fontSizeMultiplier}em` }}
      >
        <div className={styles.messageHeader}>
          <div className={styles.authorInfo}>
            {showBadges && (
              <div className={styles.badges}>
                {message.badges?.map((badge: string, index: number) => 
                  getBadgeText(badge) && (
                    <span key={index} className={`${styles.badge} ${styles[badge]}`} title={badge}>
                      {getBadgeText(badge)}
                    </span>
                  )
                )}
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
    </div>
  )
}

const Message: ThemeComponent = {
  render: MessageComponent,
  styles: ''
}

export default Message 