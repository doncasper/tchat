import type { Theme } from '../../types/chat';
import { typographyTokens } from '../base/typography';
import { spacingTokens } from '../base/spacing';

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: 'rgba(0, 0, 0, 0.8)',
    headerBackground: 'linear-gradient(90deg, #1f2937, #374151)',
    messageBackground: 'rgba(55, 65, 81, 0.6)',
    textColor: '#f9fafb',
    usernameColor: '#ffffff',
    borderColor: '#4b5563',
    accent: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  fonts: {
    family: typographyTokens.fontFamily.primary,
    size: typographyTokens.fontSize.base,
  },
  typography: {
    fontSize: typographyTokens.fontSize,
    fontWeight: typographyTokens.fontWeight,
    lineHeight: typographyTokens.lineHeight,
  },
  spacing: {
    messagePadding: `${spacingTokens.sm} ${spacingTokens.md}`,
    headerPadding: `${spacingTokens.sm} ${spacingTokens.lg}`,
  }
}; 