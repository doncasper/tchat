import type { Theme } from '../../types/chat';
import { typographyTokens } from '../base/typography';
import { spacingTokens } from '../base/spacing';

export const neonTheme: Theme = {
  name: 'neon',
  colors: {
    background: 'rgba(0, 0, 0, 0.9)',
    headerBackground: 'linear-gradient(90deg, #ff00ff, #00ffff)',
    messageBackground: 'rgba(0, 255, 255, 0.1)',
    textColor: '#ffffff',
    usernameColor: '#00ffff',
    borderColor: '#ff00ff',
    accent: '#00ff00',
    success: '#00ff00',
    warning: '#ffff00',
    error: '#ff0000',
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