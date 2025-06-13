import type { ChatConfig, Theme } from './chat';

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
  message: import('./chat').ChatMessage;
  config: ChatConfig;
  theme: Theme;
}

export interface NotificationLayoutProps {
  notification: import('./chat').ChatNotification;
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