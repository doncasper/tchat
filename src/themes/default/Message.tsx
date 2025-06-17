import type { ReactNode } from 'react'
import type { ThemeComponent, MessageProps } from '../ThemeInterface'
import styles from './Message.module.css'

const Message: ThemeComponent = {
  render: (props: MessageProps): ReactNode => {
    const { message, getBadgeText } = props
    
    return (
      <div className={styles.message}>
        <div className={styles.messageHeader}>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{message.author}</span>
            <div className={styles.badges}>
              {message.badges?.map((badge: string, index: number) => (
                <span key={index} className={`${styles.badge} ${styles[badge] || badge}`} title={badge}>
                  {getBadgeText(badge)}
                </span>
              ))}
            </div>
          </div>
          <span className={styles.messageTime}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </span>
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