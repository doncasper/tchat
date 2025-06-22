import type { Theme } from '../ThemeInterface'
import Header from './Header'
import Chat from './Chat'
import Message from './Message'
import Notification from './Notification'
import { themeFactory } from '../ThemeFactory'

// Import all CSS files
import './Header.module.css'
import './Chat.module.css'
import './Message.module.css'
import './Notification.module.css'
import animations from './animations.module.css'

const DefaultTheme: Theme = {
  name: 'default',
  Header,
  Chat,
  Message,
  Notification,
  globalStyles: ``,
  
  // Use CSS module for animations
  animationModule: animations
}

// Self-register the theme
themeFactory.registerTheme(DefaultTheme)

export default DefaultTheme 