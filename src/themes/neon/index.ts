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

const NeonTheme: Theme = {
  name: 'neon',
  Header,
  Chat,
  Message,
  Notification,
  globalStyles: `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
      min-height: 100vh;
      color: #00ffff;
    }

    .chat-app {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
      overflow: hidden;
      box-shadow: 0 0 50px rgba(0, 255, 255, 0.3);
      position: relative;
    }

    .chat-app::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 10% 10%, rgba(0, 255, 255, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 90% 90%, rgba(255, 0, 102, 0.05) 0%, transparent 50%);
      pointer-events: none;
    }
  `
}

export default NeonTheme 