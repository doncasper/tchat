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
            (() => {
              switch (message.type) {
                case 'notification':
                  return <Notification.render key={message.id} notification={message} getUserType={getUserType} />;
                case 'message':
                  return <Message.render key={message.id} message={message} getBadgeText={getBadgeText} getUserType={getUserType} />;
                default:
                  console.log('Unknown message type:', message.type)
                  return null;
              }
            })()
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    )
  },
  styles: ''
}

export default Chat 