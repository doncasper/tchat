import type { ReactNode } from 'react'
import type { ChatDataItem } from '../types/ChatTypes'

// Animation configuration interface
export interface AnimationConfig {
  enableAnimations: boolean
  animationSpeed: 'slow' | 'normal' | 'fast'
}

// Animation styles interface for theme-specific animations
export interface AnimationStyles {
  messageAnimation?: string
  notificationAnimation?: string
  badgeTransition?: string
  settingsModalAnimation?: string
  // Theme-specific animations
  [key: string]: string | undefined
}

// Utility function to generate theme-specific animation class names
export const getThemeAnimationClass = (themeName: string, componentType: string): string => {
  return `${themeName}-${componentType}`
}

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
  // Optional: Theme can provide animation styles if it supports animations
  animationStyles?: string
}

// Theme factory interface
export interface ThemeFactory {
  createTheme(themeName: string): Theme
  getAvailableThemes(): string[]
}

export interface ChatProps {
  messages: ChatDataItem[]
  messagesEndRef: React.RefObject<HTMLDivElement>
  getBadgeText: (badge: string) => string
  getUserType: (badges: string[]) => string
}

export interface HeaderProps {
  streamTitle: string
  viewerCount: number
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