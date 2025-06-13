import type { Theme } from '../types/chat';

export const defaultTheme: Theme = {
  name: 'default',
  colors: {
    background: 'rgba(0, 0, 0, 0.7)',
    headerBackground: 'linear-gradient(90deg, #9146ff, #bf46ff)',
    messageBackground: 'rgba(255, 255, 255, 0.1)',
    textColor: 'rgba(255, 255, 255, 0.9)',
    usernameColor: '#fff',
    borderColor: '#b6b6b6',
    accent: '#9146ff',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  fonts: {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    size: '0.81em'
  },
  spacing: {
    messagePadding: '8px 12px',
    headerPadding: '8px 16px'
  },
  typography: {
    fontSize: {
      xs: '0.75em',
      sm: '0.875em',
      base: '1em',
      lg: '1.125em',
      xl: '1.25em',
      '2xl': '1.5em',
      '3xl': '1.875em'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  }
}; 