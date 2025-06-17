import type { Theme, ThemeFactory } from './ThemeInterface'
import DefaultTheme from './default'
import NeonTheme from './neon'

class ChatThemeFactory implements ThemeFactory {
  private themes: Map<string, Theme> = new Map()

  constructor() {
    // Register available themes
    this.themes.set('default', DefaultTheme)
    this.themes.set('neon', NeonTheme)
  }

  createTheme(themeName: string): Theme {
    const theme = this.themes.get(themeName)
    if (!theme) {
      console.warn(`Theme "${themeName}" not found, falling back to default theme`)
      return this.themes.get('default')!
    }
    return theme
  }

  getAvailableThemes(): string[] {
    return Array.from(this.themes.keys())
  }

  // Method to dynamically register new themes
  registerTheme(theme: Theme): void {
    this.themes.set(theme.name, theme)
  }

  // Method to unregister themes
  unregisterTheme(themeName: string): boolean {
    if (themeName === 'default') {
      console.warn('Cannot unregister default theme')
      return false
    }
    return this.themes.delete(themeName)
  }
}

// Create and export a singleton instance
export const themeFactory = new ChatThemeFactory()
export default themeFactory 