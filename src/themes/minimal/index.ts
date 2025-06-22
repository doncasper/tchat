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

const MinimalTheme: Theme = {
  name: 'minimal',
  Header,
  Chat,
  Message,
  Notification,
  globalStyles: `
    /* Minimal theme - no animations */
    * {
      animation: none !important;
      transition: none !important;
    }
  `
  // No animationStyles property - this theme opts out of animations
}

// Self-register the theme
themeFactory.registerTheme(MinimalTheme)

export default MinimalTheme 