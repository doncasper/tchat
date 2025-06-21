import { useEffect } from 'react'
import { useThemeStore } from './themeStore'

export const useThemeInitializer = () => {
  const { currentTheme } = useThemeStore()

  useEffect(() => {
    // Apply global styles on mount
    const existingStyle = document.getElementById('theme-global-styles')
    if (existingStyle) {
      existingStyle.remove()
    }

    const styleElement = document.createElement('style')
    styleElement.id = 'theme-global-styles'
    styleElement.textContent = currentTheme.globalStyles
    document.head.appendChild(styleElement)

    // Cleanup function
    return () => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement)
      }
    }
  }, [currentTheme])
} 