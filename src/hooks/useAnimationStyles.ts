import { useEffect } from 'react'
import { useUIStore } from '../store/uiStore'

export const useAnimationStyles = () => {
  const { enableAnimations, animationSpeed } = useUIStore()

  useEffect(() => {
    // Remove existing animation styles
    const existingStyle = document.getElementById('animation-styles')
    if (existingStyle) {
      existingStyle.remove()
    }

    if (!enableAnimations) {
      // If animations are disabled, add styles to disable all animations
      const styleElement = document.createElement('style')
      styleElement.id = 'animation-styles'
      styleElement.textContent = `
        * {
          animation: none !important;
          transition: none !important;
        }
      `
      document.head.appendChild(styleElement)
      return
    }

    // Calculate animation duration based on speed
    let duration = 0.3 // default
    switch (animationSpeed) {
      case 'slow':
        duration = 0.5
        break
      case 'fast':
        duration = 0.15
        break
      default:
        duration = 0.3
    }

    // Create dynamic animation styles
    const styleElement = document.createElement('style')
    styleElement.id = 'animation-styles'
    styleElement.textContent = `
      /* Message animations */
      .message {
        animation: slideIn ${duration}s ease-out !important;
      }

      .message .badge {
        transition: transform ${duration * 0.67}s ease !important;
      }

      /* Notification animations */
      .notification {
        animation: slideIn ${duration}s ease-out !important;
      }

      .notification::before {
        animation: shimmer ${duration * 7}s infinite !important;
      }

      /* Neon theme specific animations */
      .neon-message {
        animation: neon-slide-in ${duration}s ease-out !important;
      }

      .neon-message::before {
        animation: neon-scan ${duration * 4}s infinite !important;
      }

      .neon-notification {
        animation: neon-notification-slide-in ${duration}s ease-out !important;
      }

      .neon-notification::before {
        animation: neon-notification-scan ${duration * 2}s infinite !important;
      }

      /* Settings modal animation */
      .settingsModal {
        animation: slideIn ${duration}s ease-out !important;
      }

      /* Keyframes for animations */
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

      @keyframes neon-scan {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      @keyframes neon-slide-in {
        from {
          opacity: 0;
          transform: translateY(20px);
          box-shadow: 0 0 0 rgba(0, 255, 255, 0);
        }
        to {
          opacity: 1;
          transform: translateY(0);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
        }
      }

      @keyframes neon-notification-scan {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      @keyframes neon-notification-slide-in {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
          box-shadow: 0 0 0 rgba(255, 0, 102, 0);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
          box-shadow: 0 0 30px rgba(255, 0, 102, 0.3);
        }
      }
    `

    document.head.appendChild(styleElement)

    // Cleanup function
    return () => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement)
      }
    }
  }, [enableAnimations, animationSpeed])
} 