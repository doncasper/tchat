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
    if (!currentTheme) return

    const existingThemeAnimationStyle = document.getElementById('theme-animation-styles')
    if (existingThemeAnimationStyle) {
      existingThemeAnimationStyle.remove()
    }

    if (!enableAnimations) return

    let themeStyles = ''

    // If theme has animationStyles string, use it
    if (currentTheme.animationStyles) {
      themeStyles = currentTheme.animationStyles
    }
    // If theme has animationModule, extract styles from it
    else if (currentTheme.animationModule) {
      themeStyles = extractStylesFromCSSModule(currentTheme.animationModule, currentTheme.name)
    }

    if (themeStyles) {
      const themeStyleElement = document.createElement('style')
      themeStyleElement.id = 'theme-animation-styles'
      themeStyleElement.textContent = themeStyles
      document.head.appendChild(themeStyleElement)

      return () => {
        if (themeStyleElement.parentNode) {
          themeStyleElement.parentNode.removeChild(themeStyleElement)
        }
      }
    }
  }, [currentTheme, enableAnimations])
}

// Function to extract CSS styles from CSS module
const extractStylesFromCSSModule = (cssModule: any, themeName: string): string => {
  // Get the actual CSS class names from the module
  const classNames = Object.values(cssModule) as string[]
  
  // Find the CSS rules in the stylesheet and extract them
  const styleSheets = Array.from(document.styleSheets)
  let extractedStyles = ''
  
  for (const sheet of styleSheets) {
    try {
      const rules = Array.from(sheet.cssRules || sheet.rules)
      for (const rule of rules) {
        if (rule instanceof CSSStyleRule) {
          // Check if this rule contains any of our CSS module class names
          const hasModuleClass = classNames.some(className => 
            rule.selectorText.includes(className)
          )
          
          if (hasModuleClass) {
            // Replace CSS module class names with theme-specific class names
            let cssText = rule.cssText
            
            // Replace each CSS module class with a theme-specific class
            classNames.forEach(className => {
              const themeClass = `.${themeName.toLowerCase()}-${className.split('_').pop()?.toLowerCase()}`
              cssText = cssText.replace(new RegExp(`\\.${className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'), themeClass)
            })
            
            extractedStyles += cssText + '\n'
          }
        }
      }
    } catch (e) {
      // Skip cross-origin stylesheets
      continue
    }
  }
  
  return extractedStyles
} 