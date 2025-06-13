import React from 'react';
import { themeFactories } from '../themes/ThemeFactory';
import type { ChatMessage } from '../types/chat';

interface ChatMessageListProps {
  messages: ChatMessage[];
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  const { Message } = themeFactories.default;
  return (
    <div className="chat-messages">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
    </div>
  );
}; 