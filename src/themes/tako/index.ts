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

const TakoTheme: Theme = {
  name: 'tako',
  Header,
  Chat,
  Message,
  Notification,
  globalStyles: ``,
  
  // Tako theme has unique animation styles
  animationStyles: `
    /* Tako Theme Animations */
    
    /* Message animations */
    .tako-message {
      animation: takoSlideIn var(--animation-duration) cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    .tako-message .badge {
      transition: transform var(--animation-duration-fast) ease;
    }
    
    .tako-message:hover {
      transform: scale(1.02);
      transition: transform 0.2s ease;
    }
    
    /* Notification animations */
    .tako-notification {
      animation: takoNotificationPop var(--animation-duration) ease-out;
    }
    
    .tako-notification::before {
      animation: takoShimmer var(--animation-duration-very-slow) infinite;
    }
    
    /* Settings modal animation */
    .tako-settings-modal {
      animation: takoModalSlide var(--animation-duration) ease-out;
    }
    
    /* Tako-specific keyframes */
    @keyframes takoSlideIn {
      from {
        opacity: 0;
        transform: translateY(30px) rotate(-2deg);
      }
      to {
        opacity: 1;
        transform: translateY(0) rotate(0deg);
      }
    }
    
    @keyframes takoNotificationPop {
      0% {
        opacity: 0;
        transform: scale(0.8) translateY(20px);
      }
      50% {
        transform: scale(1.05) translateY(-5px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    
    @keyframes takoShimmer {
      0% { transform: translateX(-100%) skewX(-15deg); }
      100% { transform: translateX(100%) skewX(-15deg); }
    }
    
    @keyframes takoModalSlide {
      from {
        opacity: 0;
        transform: translateY(-50px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `
}

// Self-register the theme
themeFactory.registerTheme(TakoTheme)

export default TakoTheme 