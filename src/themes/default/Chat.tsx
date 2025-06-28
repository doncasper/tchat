import type { ReactNode } from 'react'
import type { ThemeComponent, ChatProps } from '../ThemeInterface'
import type { ChatDataItem } from '../../types/ChatTypes'
import { VirtualChatWrapper } from '../../components/VirtualScroll'
import styles from './Chat.module.css'
import Message from './Message'
import Notification from './Notification'

const Chat: ThemeComponent = {
  render: (props: ChatProps): ReactNode => {
    const { messages, messagesEndRef, getBadgeText, getUserType } = props
    
    const renderMessage = (message: ChatDataItem) => (
      <Message.render 
        message={message} 
        getBadgeText={getBadgeText} 
        getUserType={getUserType} 
      />
    )
    
    const renderNotification = (notification: ChatDataItem) => (
      <Notification.render 
        notification={notification} 
        getBadgeText={getBadgeText}
      />
    )
    
    return (
      <div className={styles.chatContainer}>
        <VirtualChatWrapper
          messages={messages}
          messagesEndRef={messagesEndRef}
          renderMessage={renderMessage}
          renderNotification={renderNotification}
        />
      </div>
    )
  },
  styles: ''
}

export default Chat 