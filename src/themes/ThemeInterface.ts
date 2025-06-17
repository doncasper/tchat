import type { ReactNode } from 'react'

// Base interface for theme components
export interface ThemeComponent {
  render: (props: any) => ReactNode
  styles: string
}

// Theme interface that defines all themeable components
export interface Theme {
  name: string
  Header: ThemeComponent
  Chat: ThemeComponent
  Message: ThemeComponent
  Notification: ThemeComponent
  globalStyles: string
}

// Theme factory interface
export interface ThemeFactory {
  createTheme(themeName: string): Theme
  getAvailableThemes(): string[]
} 