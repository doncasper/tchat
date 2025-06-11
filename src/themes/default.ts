import type { Theme } from '../types/chat';

export const defaultTheme: Theme = {
  name: 'default',
  colors: {
    background: 'rgba(0, 0, 0, 0.7)',
    headerBackground: 'linear-gradient(90deg, #9146ff, #bf46ff)',
    messageBackground: 'rgba(255, 255, 255, 0.1)',
    textColor: 'rgba(255, 255, 255, 0.9)',
    usernameColor: '#fff',
    borderColor: '#b6b6b6'
  },
  fonts: {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    size: '0.81em'
  },
  spacing: {
    messagePadding: '8px 12px',
    headerPadding: '8px 16px'
  }
}; 