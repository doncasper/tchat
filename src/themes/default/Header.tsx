import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  status: string;
  showHeader?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ status, showHeader = true }) => {
  if (!showHeader) return null;
  return (
    <div className={styles.header}>
      <span className={styles['header-title']}>Twitch Chat</span>
      <span className={styles['header-status']}>{status}</span>
    </div>
  );
}; 