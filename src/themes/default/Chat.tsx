import type { ReactNode } from 'react'
import type { ThemeComponent, ChatProps } from '../ThemeInterface'
import styles from './Chat.module.css'
import Message from './Message'
import Notification from './Notification'

const Chat: ThemeComponent = {
  render: (props: ChatProps): ReactNode => {
    const { messages, messagesEndRef, getBadgeText, getUserType } = props
    
    return (
      <div className={styles.chatContainer}>
        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            message.type === 'notification' ? (
              <Notification.render key={message.id} notification={message} getUserType={getUserType} />
            ) : (
              <Message.render key={message.id} message={message} getBadgeText={getBadgeText} />
            )
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    )
  },
  styles: ''
}

export default Chat 