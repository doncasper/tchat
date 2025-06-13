import { Header } from './default/Header';
import { Message } from './default/Message';
import { Notification } from './default/Notification';

export const themeFactories = {
  default: { Header, Message, Notification },
  // Add more themes here (e.g., neon, minimal, etc.)
};

export type ThemeName = keyof typeof themeFactories; 