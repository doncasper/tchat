import type { ComponentType } from 'react'
import type { ChatDataItem } from '../types/ChatTypes'

// Base interface for theme components
export interface ThemeComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render: ComponentType<any>
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

export interface ChatProps {
  messages: ChatDataItem[]
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  getBadgeText: (badge: string) => string
  getUserType: (badges: string[]) => string
}

export interface HeaderProps {
  streamTitle: string
  viewerCount: number
  connectionStatus: string
  onSettingsClick: () => void
  onThemeSwitch: (theme: string) => void
  currentTheme: string
  availableThemes: string[]
}

export interface MessageProps {
  message: ChatDataItem
  getBadgeText: (badge: string) => string
}

export interface NotificationProps {
  notification: ChatDataItem
  getBadgeText: (badge: string) => string
}