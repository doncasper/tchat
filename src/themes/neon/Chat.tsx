import type { ReactNode } from 'react'
import type { ThemeComponent, ChatProps } from '../ThemeInterface'
import styles from './Chat.module.css'


const Chat: ThemeComponent = {
  render: (props: ChatProps): ReactNode => {
    const { messages, messagesEndRef, getBadgeText } = props
    
    return (
      <div className={styles.chatContainer}>
        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <div key={message.id} className={styles.message}>
              <div className={styles.messageHeader}>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{message.author}</span>
                  <div className={styles.badges}>
                    {message.badges?.map((badge: string, index: number) => (
                      <span key={index} className={`${styles.badge} ${badge}`} title={badge}>
                        {getBadgeText(badge)}
                      </span>
                    ))}
                  </div>
                </div>
                <span className={styles.messageTime}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
              </div>
              <div className={styles.messageContent}>
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    )
  },
  styles: ''
}

export default Chat 