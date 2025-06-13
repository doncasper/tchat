import React from 'react';
import { themeFactories } from '../themes/ThemeFactory';

interface ChatHeaderProps {
  status: string;
  showHeader?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ status, showHeader }) => {
  const { Header } = themeFactories.default;
  return <Header status={status} showHeader={showHeader} />;
}; 