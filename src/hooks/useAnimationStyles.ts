import { useEffect } from 'react'
import { useThemeStore } from '../store/themeStore'

export const useAnimationStyles = () => {
  const { currentTheme } = useThemeStore()

  // Apply theme-specific animation styles if the theme provides them
  useEffect(() => {
    if (!currentTheme) return

    const existingThemeAnimationStyle = document.getElementById('theme-animation-styles')
    if (existingThemeAnimationStyle) {
      existingThemeAnimationStyle.remove()
    }

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
  }, [currentTheme])
}

// Function to extract CSS styles from CSS module
const extractStylesFromCSSModule = (cssModule: Record<string, string>, themeName: string): string => {
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
    } catch {
      // Skip cross-origin stylesheets
      continue
    }
  }
  
  return extractedStyles
} 