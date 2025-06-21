import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { themeFactory } from '../themes/ThemeFactory'
import type { Theme } from '../themes/ThemeInterface'

interface ThemeState {
  // Theme state
  currentTheme: Theme
  currentThemeName: string
  availableThemes: string[]
  
  // Actions
  switchTheme: (themeName: string) => void
  registerTheme: (theme: Theme) => void
  unregisterTheme: (themeName: string) => boolean
  
  // Computed
  isThemeAvailable: (themeName: string) => boolean
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentTheme: themeFactory.createTheme('default'),
        currentThemeName: 'default',
        availableThemes: themeFactory.getAvailableThemes(),
        
        // Actions
        switchTheme: (themeName) => {
          const { availableThemes } = get()
          
          if (availableThemes.includes(themeName)) {
            const newTheme = themeFactory.createTheme(themeName)
            set({
              currentTheme: newTheme,
              currentThemeName: themeName
            })
            
            // Apply global styles
            applyGlobalStyles(newTheme.globalStyles)
          } else {
            console.warn(`Theme "${themeName}" not found`)
          }
        },
        
        registerTheme: (theme) => {
          themeFactory.registerTheme(theme)
          set({ availableThemes: themeFactory.getAvailableThemes() })
        },
        
        unregisterTheme: (themeName) => {
          const success = themeFactory.unregisterTheme(themeName)
          if (success) {
            set({ availableThemes: themeFactory.getAvailableThemes() })
          }
          return success
        },
        
        // Computed
        isThemeAvailable: (themeName) => {
          const { availableThemes } = get()
          return availableThemes.includes(themeName)
        }
      }),
      {
        name: 'theme-storage',
        partialize: (state) => ({
          currentThemeName: state.currentThemeName
        })
      }
    ),
    {
      name: 'theme-store'
    }
  )
)

// Helper function to apply global styles
function applyGlobalStyles(globalStyles: string) {
  // Remove existing theme styles
  const existingStyle = document.getElementById('theme-global-styles')
  if (existingStyle) {
    existingStyle.remove()
  }

  // Add new theme styles
  const styleElement = document.createElement('style')
  styleElement.id = 'theme-global-styles'
  styleElement.textContent = globalStyles
  document.head.appendChild(styleElement)
} 