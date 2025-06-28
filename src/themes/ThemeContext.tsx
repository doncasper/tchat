import React, { createContext, useState, useEffect, type ReactNode } from 'react'
import type { Theme } from './ThemeInterface'
import { themeFactory } from './ThemeFactory'

export interface ThemeContextType {
  currentTheme: Theme
  currentThemeName: string
  availableThemes: string[]
  switchTheme: (themeName: string) => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  initialTheme?: string
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = 'default' 
}) => {
  const [currentThemeName, setCurrentThemeName] = useState(initialTheme)
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => 
    themeFactory.createTheme(initialTheme)
  )

  const availableThemes = themeFactory.getAvailableThemes()

  const switchTheme = (themeName: string) => {
    console.log('Switching theme to', themeName)
    if (availableThemes.includes(themeName)) {
      setCurrentThemeName(themeName)
      setCurrentTheme(themeFactory.createTheme(themeName))
      
      // Store theme preference in localStorage
      localStorage.setItem('chat-theme', themeName)
    }
  }

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('chat-theme')
    if (savedTheme && availableThemes.includes(savedTheme)) {
      setCurrentThemeName(savedTheme)
      setCurrentTheme(themeFactory.createTheme(savedTheme))
    }
  }, [availableThemes])

  // Apply global styles when theme changes
  useEffect(() => {
    // Remove existing theme styles
    const existingStyle = document.getElementById('theme-global-styles')
    if (existingStyle) {
      existingStyle.remove()
    }

    // Add new theme styles
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

  const value: ThemeContextType = {
    currentTheme,
    currentThemeName,
    availableThemes,
    switchTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

 