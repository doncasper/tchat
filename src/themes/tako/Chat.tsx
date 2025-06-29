import type { ReactNode } from 'react'
import type { ThemeComponent, ChatProps } from '../ThemeInterface'
import type { ChatDataItem } from '../../types/ChatTypes'
import { VirtualChatWrapper } from '../../components/VirtualScroll'
import { useUIStore } from '../../store/uiStore'
import styles from './Chat.module.css'
import Message from './Message'
import Notification from './Notification'

const ChatComponent = (props: ChatProps): ReactNode => {
  const { messages, messagesEndRef, getBadgeText } = props
  const { showBackground } = useUIStore()
  
  const MessageComponent = Message.render
  const NotificationComponent = Notification.render
  
  const renderMessage = (message: ChatDataItem) => (
    <MessageComponent 
      message={message} 
      getBadgeText={getBadgeText} 
    />
  )
  
  const renderNotification = (notification: ChatDataItem) => (
    <NotificationComponent 
      notification={notification} 
      getBadgeText={getBadgeText}
    />
  )
  
  return (
    <div 
      className={styles.chatContainer}
      style={{
        background: showBackground 
          ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.5) 0%, rgba(118, 75, 162, 0.5) 100%)'
          : 'transparent'
      }}
    >
      <VirtualChatWrapper
        messages={messages}
        messagesEndRef={messagesEndRef}
        renderMessage={renderMessage}
        renderNotification={renderNotification}
      />
    </div>
  )
}

const Chat: ThemeComponent = {
  render: ChatComponent,
  styles: ''
}

export default Chat 