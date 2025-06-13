import React from 'react';
import type { ChatConfig, Theme, ChatMessage } from '../types/chat';
import { defaultTheme } from '../themes/default';
import './ChatOverlay.css';
import { useTwitchChat } from '../hooks/useTwitchChat';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';

interface ChatOverlayProps {
  channel?: string;
  theme?: Theme;
  config?: Partial<ChatConfig>;
}

const DEFAULT_CONFIG: Partial<ChatConfig> = {
  maxMessages: 35,
  messageDuration: 100000, // 100 seconds
  enableBackground: true,
  scale: 1.0,
  showHeader: true,
  radius: 8,
  enableMessageShadow: true,
  enableTextShadow: true
};

export const ChatOverlay: React.FC<ChatOverlayProps> = ({ 
  channel = 'takotoken',
  theme = defaultTheme,
  config = {}
}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const { messages, status } = useTwitchChat({
    channel,
    messageDuration: finalConfig.messageDuration,
    maxMessages: finalConfig.maxMessages,
  });

  const getContainerStyle = () => {
    const style: React.CSSProperties = {
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      background: finalConfig.enableBackground ? theme.colors.background : 'transparent',
      borderRadius: `${finalConfig.radius}px`,
      fontSize: `${16 * (finalConfig.scale ?? 1)}px`,
    };

    if (finalConfig.enableBackground) {
      style.backdropFilter = 'blur(5px)';
    }

    return style;
  };

  return (
    <div className="chat-container" style={getContainerStyle()}>
      <ChatHeader status={status} showHeader={finalConfig.showHeader} />
      <ChatMessageList messages={messages as ChatMessage[]} />
    </div>
  );
}; 