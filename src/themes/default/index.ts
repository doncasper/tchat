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
  
  // Animation styles extracted from CSS module
  animationStyles: `
    /* Default Theme Animations */
    
    /* Message animations */
    .default-message {
      animation: slideIn var(--animation-duration) ease-out;
    }
    
    .default-message .badge {
      transition: transform var(--animation-duration-fast) ease;
    }
    
    /* Notification animations */
    .default-notification {
      animation: slideIn var(--animation-duration) ease-out;
    }
    
    .default-notification::before {
      animation: shimmer var(--animation-duration-very-slow) infinite;
    }
    
    /* Settings modal animation */
    .default-settings-modal {
      animation: slideIn var(--animation-duration) ease-out;
    }
    
    /* Keyframes */
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `
}

// Self-register the theme
themeFactory.registerTheme(DefaultTheme)

export default DefaultTheme 