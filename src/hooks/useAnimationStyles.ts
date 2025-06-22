import { useEffect } from 'react'
import { useUIStore } from '../store/uiStore'
import { useThemeStore } from '../store/themeStore'

export const useAnimationStyles = () => {
  const { enableAnimations, animationSpeed } = useUIStore()
  const { currentTheme } = useThemeStore()

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
        :root {
          --animation-duration: 0s !important;
          --animation-enabled: 0 !important;
        }
        
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

    // Create dynamic animation styles using CSS custom properties
    const styleElement = document.createElement('style')
    styleElement.id = 'animation-styles'
    styleElement.textContent = `
      :root {
        --animation-duration: ${duration}s;
        --animation-enabled: 1;
        --animation-duration-fast: ${duration * 0.67}s;
        --animation-duration-slow: ${duration * 2}s;
        --animation-duration-very-slow: ${duration * 4}s;
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

  // Apply theme-specific animation styles if the theme provides them
  useEffect(() => {
    if (!currentTheme?.animationStyles) return

    const existingThemeAnimationStyle = document.getElementById('theme-animation-styles')
    if (existingThemeAnimationStyle) {
      existingThemeAnimationStyle.remove()
    }

    if (enableAnimations) {
      const themeStyleElement = document.createElement('style')
      themeStyleElement.id = 'theme-animation-styles'
      themeStyleElement.textContent = currentTheme.animationStyles
      document.head.appendChild(themeStyleElement)

      return () => {
        if (themeStyleElement.parentNode) {
          themeStyleElement.parentNode.removeChild(themeStyleElement)
        }
      }
    }
  }, [currentTheme, enableAnimations])
} 