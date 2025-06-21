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

const TakoTheme: Theme = {
  name: 'tako',
  Header,
  Chat,
  Message,
  Notification,
  globalStyles: ``
}

// Self-register the theme
themeFactory.registerTheme(TakoTheme)

export default TakoTheme 