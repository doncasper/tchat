import type { ReactNode } from 'react'
import type { ThemeComponent, MessageProps } from '../ThemeInterface'
import { useUIStore } from '../../store/uiStore'
import { EmoteRenderer } from '../../components/EmoteRenderer'
import { BadgeRenderer } from '../../components/BadgeRenderer/BadgeRenderer'
import styles from './Message.module.css'
import broadcasterImage from './img/chill.png'
import moderatorImage from './img/coffee.png'

const MessageComponent = (props: MessageProps): ReactNode => {
  const { message } = props
  const { showTimestamps, fontSizeMultiplier } = useUIStore()
  
  return (
    <div className={styles.messageContainer}>
      <div className={`${styles.userTypeLogo} ${styles[message.userType || '']}`}>
        {message.userType === 'moderator' && (
          <img src={moderatorImage} alt="Tako Moderator" />
        )}
        {message.userType === 'broadcaster' && (
          <img src={broadcasterImage} alt="Tako Broadcaster" />
        )}
      </div>
      <span className={styles.authorName} style={{ backgroundColor: message.color }}>
        {message.nickname}
      </span>
      <span className={styles.badges}>
        {message.badges && <BadgeRenderer badges={message.badges} badgeInfo={message.badgeInfo} className={styles.badge} />}
      </span>
      <div 
        className={`${styles.message} ${styles[message.userType || '']}`}
        style={{ fontSize: `${fontSizeMultiplier}em` }}
      >
        {showTimestamps && (
          <span className={styles.messageTime}>
            {message.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </span>
        )}
        <div className={styles.messageContent}>
          <EmoteRenderer text={message.text} emotes={message.emotes} />
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