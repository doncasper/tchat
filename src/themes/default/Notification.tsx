import React from 'react';
import type { ChatNotification } from '../../types/chat';

interface NotificationProps {
  notification: ChatNotification;
}

export const Notification: React.FC<NotificationProps> = ({ notification }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5em',
      padding: '0.75em 1em',
      margin: '0.5em 0',
      background: 'linear-gradient(90deg, #9146ff, #bf46ff)',
      color: '#fff',
      borderRadius: 8,
      fontWeight: 600,
      fontSize: '1.1em',
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    }}>
      <span style={{ fontWeight: 700, marginRight: 8 }}>{notification.title}</span>
      <span>{notification.message}</span>
    </div>
  );
}; 