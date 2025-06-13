import React from 'react';

interface HeaderProps {
  status: string;
  showHeader?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ status, showHeader = true }) => {
  if (!showHeader) return null;
  return (
    <div style={{
      background: 'linear-gradient(90deg, #9146ff, #bf46ff)',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      color: '#fff',
      fontWeight: 600,
      fontSize: '1.1em',
    }}>
      <span style={{ flex: 1 }}>Twitch Chat</span>
      <span style={{ fontSize: '0.95em', opacity: 0.8 }}>{status}</span>
    </div>
  );
}; 