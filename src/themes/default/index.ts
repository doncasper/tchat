import type { Theme } from '../ThemeInterface'
import Header from './Header'
import Chat from './Chat'
import Message from './Message'
import Notification from './Notification'

// Import all CSS files
import './Header.module.css'
import './Chat.module.css'
import './Message.module.css'
import './Notification.module.css'

const DefaultTheme: Theme = {
  name: 'default',
  Header,
  Chat,
  Message,
  Notification,
  globalStyles: ``
}

export default DefaultTheme 