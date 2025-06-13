import React from 'react';
import type { ChatConfig, ChatMessage } from '../types/chat';
import './ChatOverlay.css';
import { useTwitchChat } from '../hooks/useTwitchChat';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';

interface ChatOverlayProps {
  channel?: string;
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
  config = {}
}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const { messages, status } = useTwitchChat({
    channel,
    messageDuration: finalConfig.messageDuration,
    maxMessages: finalConfig.maxMessages,
  });

  // Dynamic container style for borderRadius, fontSize, background, blur
  const containerStyle: React.CSSProperties = {
    borderRadius: `${finalConfig.radius}px`,
    fontSize: `${16 * (finalConfig.scale ?? 1)}px`,
    background: finalConfig.enableBackground ? 'var(--chat-bg)' : 'transparent',
    backdropFilter: finalConfig.enableBackground ? 'blur(5px)' : undefined,
  };

  return (
    <div className="chat-container" style={containerStyle}>
      <ChatHeader status={status} showHeader={finalConfig.showHeader} />
      <ChatMessageList messages={messages as ChatMessage[]} />
    </div>
  );
}; 