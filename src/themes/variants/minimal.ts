import type { Theme } from '../../types/chat';
import { typographyTokens } from '../base/typography';
import { spacingTokens } from '../base/spacing';

export const minimalTheme: Theme = {
  name: 'minimal',
  colors: {
    background: 'rgba(255, 255, 255, 0.95)',
    headerBackground: '#f8fafc',
    messageBackground: 'rgba(248, 250, 252, 0.8)',
    textColor: '#1e293b',
    usernameColor: '#475569',
    borderColor: '#e2e8f0',
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