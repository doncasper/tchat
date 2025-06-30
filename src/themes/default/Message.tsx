import type { ReactNode } from 'react'
import type { ThemeComponent, MessageProps } from '../ThemeInterface'
import { useUIStore } from '../../store/uiStore'
import { EmoteRenderer } from '../../components/EmoteRenderer'
import { BadgeRenderer } from '../../components/BadgeRenderer/BadgeRenderer'
import styles from './Message.module.css'

const MessageComponent = (props: MessageProps): ReactNode => {
  const { message } = props
  const { showTimestamps, fontSizeMultiplier } = useUIStore()
  
  return (
    <div 
      className={`${styles.message} ${styles[message.userType || '']}`}
      style={{ fontSize: `${fontSizeMultiplier}em` }}
    >
      <div className={styles.messageHeader}>
        <div className={styles.authorInfo}>
          <span className={styles.authorName}>{message.nickname}</span>
          {message.badges && <BadgeRenderer badges={message.badges} />}
        </div>
        {showTimestamps && (
          <span className={styles.messageTime}>
            {message.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </span>
        )}
      </div>
      <div className={styles.messageContent}>
        <EmoteRenderer text={message.text} emotes={message.emotes} />
      </div>
    </div>
  )
}

const Message: ThemeComponent = {
  render: MessageComponent,
  styles: ''
}

export default Message 