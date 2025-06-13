import React from 'react';
import type { ChatMessage, Emote } from '../../types/chat';
import styles from './Message.module.css';

interface MessageProps {
  message: ChatMessage;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  let messageClass = styles.default;
  if (message.isSubscriber) messageClass = styles.subscriber;
  else if (message.isModerator) messageClass = styles.moderator;

  return (
    <div className={`${styles.message} ${messageClass}`}>
      <span
        className={`${styles.username} ${styles['username-gradient']}`}
        style={{
          // Pass the username color as a CSS variable for the gradient
          // fallback to #9146ff if not present
          ['--username-color' as any]: message.color || '#9146ff',
        }}
      >
        {message.username}
      </span>
      <span className={styles['message-text']}>
        {renderMessageWithEmotes(message.message, message.emotes)}
      </span>
    </div>
  );
};

function renderMessageWithEmotes(text: string, emotes: Emote[]) {
  if (!emotes || emotes.length === 0) return text;
  const sorted = [...emotes].sort((a, b) => a.start - b.start);
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  for (let i = 0; i < sorted.length; i++) {
    const emote = sorted[i];
    if (!emote) continue;
    if (emote.start > lastIndex) {
      elements.push(text.substring(lastIndex, emote.start));
    }
    elements.push(
      <img
        key={`emote-${i}`}
        src={emote.url}
        alt={emote.name}
        title={emote.name}
        className={styles.emote}
      />
    );
    lastIndex = emote.end + 1;
  }
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }
  return elements;
} 