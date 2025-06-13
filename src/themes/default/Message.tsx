import React from 'react';
import type { ChatMessage, Emote } from '../../types/chat';

interface MessageProps {
  message: ChatMessage;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.5em',
      padding: '0.5em',
      marginBottom: '0.25em',
      background: message.isSubscriber
        ? 'rgba(145, 70, 255, 0.15)'
        : message.isModerator
        ? 'rgba(0, 255, 0, 0.15)'
        : 'rgba(255,255,255,0.08)',
      borderLeft: `2px dotted ${
        message.isSubscriber ? '#9146ff' : message.isModerator ? '#00ff00' : '#b6b6b6'
      }`,
      color: '#fff',
      fontSize: '1em',
      fontFamily: 'inherit',
      lineHeight: 1.3,
    }}>
      <span style={{
        fontWeight: 700,
        marginRight: '0.5em',
        background: `linear-gradient(90deg, ${message.color}, #6e2bbf)`,
        color: '#fff',
        borderRadius: 4,
        padding: '0 0.4em',
      }}>{message.username}</span>
      <span>{renderMessageWithEmotes(message.message, message.emotes)}</span>
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
        style={{ height: '1.8em', verticalAlign: 'middle', margin: '0 1px' }}
      />
    );
    lastIndex = emote.end + 1;
  }
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }
  return elements;
} 