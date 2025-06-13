import { darkTheme } from './variants/dark';
import { neonTheme } from './variants/neon';
import { minimalTheme } from './variants/minimal';
import type { Theme } from '../types/chat';

export const themes: Record<string, Theme> = {
  dark: darkTheme,
  neon: neonTheme,
  minimal: minimalTheme,
};

export { darkTheme, neonTheme, minimalTheme };
export type { Theme }; 