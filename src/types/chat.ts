export interface ChatItem {
  id: string;
  type: 'message' | 'notification';
  timestamp: Date;
  duration?: number; // For notifications
}

export interface ChatMessage extends ChatItem {
  type: 'message';
  username: string;
  message: string;
  badges: Badge[];
  isSubscriber: boolean;
  isModerator: boolean;
  color: string;
  emotes: Emote[];
  badgeVersions: Record<string, string>;
}

export interface ChatNotification extends ChatItem {
  type: 'notification';
  notificationType: 'subscriber' | 'follower' | 'donation' | 'raid' | 'host' | 'ban' | 'timeout';
  title: string;
  message: string;
  username?: string;
  amount?: number;
  viewers?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface Badge {
  type: string;
  version: string;
  url: string;
}

export interface Emote {
  id: string;
  name: string;
  start: number;
  end: number;
  url: string;
}

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

export interface LayoutConfig {
  name: string;
  description: string;
  preview?: string;
  components: {
    message: React.ComponentType<MessageLayoutProps>;
    notification: React.ComponentType<NotificationLayoutProps>;
    header: React.ComponentType<HeaderLayoutProps>;
  };
  styles: LayoutStyles;
}

export interface LayoutStyles {
  message: {
    container: React.CSSProperties;
    username: React.CSSProperties;
    badges: React.CSSProperties;
    text: React.CSSProperties;
    emotes: React.CSSProperties;
  };
  notification: {
    container: React.CSSProperties;
    title: React.CSSProperties;
    message: React.CSSProperties;
    icon: React.CSSProperties;
  };
  header: {
    container: React.CSSProperties;
    title: React.CSSProperties;
    status: React.CSSProperties;
    configButton: React.CSSProperties;
  };
}

export interface MessageLayoutProps {
  message: ChatMessage;
  config: ChatConfig;
  theme: Theme;
}

export interface NotificationLayoutProps {
  notification: ChatNotification;
  config: ChatConfig;
  theme: Theme;
}

export interface HeaderLayoutProps {
  channel: string;
  status: string;
  config: ChatConfig;
  theme: Theme;
  onConfigClick: () => void;
}

export interface Theme {
  name: string;
  colors: {
    background: string;
    headerBackground: string;
    messageBackground: string;
    textColor: string;
    usernameColor: string;
    borderColor: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    family: string;
    size: string;
  };
  typography: {
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
    lineHeight: Record<string, number>;
  };
  spacing: {
    messagePadding: string;
    headerPadding: string;
  };
} 