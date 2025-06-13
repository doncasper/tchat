export interface ChatConfig {
  // Query params
  channel: string;
  textSize: number; // percentage (100 = 100%)
  theme: string;
  showHeader: boolean;
  maxMessages: number;
  messageDuration: number;
  enableBackground: boolean;
  scale: number;
  radius: number;
  enableMessageShadow: boolean;
  enableTextShadow: boolean;
  
  // Layout specific
  messageLayout: string;
  notificationLayout: string;
  
  // Advanced
  enableSound: boolean;
  enableAnimations: boolean;
  autoScroll: boolean;
  showTimestamps: boolean;
  showBadges: boolean;
  showEmotes: boolean;
}

export interface NotificationConfig {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxNotifications: number;
  defaultDuration: number;
  enableSound: boolean;
  enableAnimations: boolean;
} 