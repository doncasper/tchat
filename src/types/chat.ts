export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  badges: string[];
  isSubscriber: boolean;
  isModerator: boolean;
  color: string;
  emotes: Emote[];
  badgeVersions: Record<string, string>;
  timestamp: Date;
}

export interface Emote {
  id: string;
  name: string;
  start: number;
  end: number;
}

export interface Notification {
  id: string;
  message: string;
  type: string;
  tags: Record<string, string>;
  timestamp: Date;
  isNotification: true;
}

export interface ChatConfig {
  maxMessages: number;
  messageDuration: number;
  enableBackground: boolean;
  scale: number;
  showHeader: boolean;
  radius: number;
  enableMessageShadow: boolean;
  enableTextShadow: boolean;
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
  };
  fonts: {
    family: string;
    size: string;
  };
  spacing: {
    messagePadding: string;
    headerPadding: string;
  };
} 