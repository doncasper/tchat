import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage, ChatConfig, Theme } from '../types/chat';
import { defaultTheme } from '../themes/default';
import './ChatOverlay.css';

interface ChatOverlayProps {
  channel?: string;
  theme?: Theme;
  config?: Partial<ChatConfig>;
}

const DEFAULT_CONFIG: ChatConfig = {
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState('Connecting...');
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const cleanupIntervalRef = useRef<number | null>(null);
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  useEffect(() => {
    connectToChat();
    
    // Start cleanup interval
    cleanupIntervalRef.current = setInterval(() => {
      const now = Date.now();
      setMessages(prev => {
        const validMessages = prev.filter(msg => {
          const messageAge = now - msg.timestamp.getTime();
          return messageAge < finalConfig.messageDuration;
        });
        
        return validMessages;
      });
    }, 5000); // Check every 5 seconds

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      // Clear cleanup interval
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
    };
  }, [channel, finalConfig.messageDuration]);

  const connectToChat = () => {
    try {
      const ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to Twitch IRC');
        authenticate();
      };

      ws.onmessage = (event) => {
        handleMessage(event.data);
      };

      ws.onerror = (error) => {
        console.warn('WebSocket error:', error);
        setStatus('Connection error');
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log('Disconnected from Twitch IRC');
        setStatus('Disconnected');
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Failed to connect:', error);
      setStatus('Connection failed');
    }
  };

  const authenticate = () => {
    if (!wsRef.current) return;
    
    wsRef.current.send('CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands');
    wsRef.current.send('NICK justinfan12345');
    wsRef.current.send(`JOIN #${channel}`);
    setStatus(`Connected to ${channel}`);
    setIsConnected(true);
  };

  const handleMessage = (data: string) => {
    const lines = data.split('\r\n');
    lines.forEach(line => {
      if (line.startsWith('PING')) {
        if (wsRef.current) {
          wsRef.current.send('PONG :tmi.twitch.tv');
        }
        return;
      }
      if (line.includes('PRIVMSG')) {
        parseChatMessage(line);
      }
    });
  };

  const parseChatMessage = (line: string) => {
    const match = line.match(/@(.+?) PRIVMSG #\w+ :(.+)/);
    if (!match || !match[1] || !match[2]) return;

    const tags = parseTags(line);
    const username = tags['display-name'] || match[1].split('!')[0] || 'Unknown';
    const message = match[2];
    const color = parseColor(tags.color ?? '', username);
    const badges = parseBadges(tags.badges);
    const emotes = parseEmotes(tags.emotes, message);
    const isSubscriber = tags.subscriber === '1';
    const isModerator = tags.mod === '1';

    const messageObj: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(),
      username,
      message,
      badges,
      isSubscriber,
      isModerator,
      color,
      emotes,
      badgeVersions: {},
      timestamp: new Date()
    };

    addMessage(messageObj);
  };

  const parseTags = (line: string): Record<string, string> => {
    const tagsMatch = line.match(/@(.+?) /);
    if (!tagsMatch) return {};
    
    const tagsString = tagsMatch[1];
    if (!tagsString) return {};
    
    const tags: Record<string, string> = {};
    
    tagsString.split(';').forEach(tag => {
      const [key, value] = tag.split('=');
      if (key && value !== undefined) {
        tags[key] = value;
      }
    });
    
    return tags;
  };

  const parseColor = (colorTag: string | undefined, username: string): string => {
    if (!colorTag || colorTag === '') {
      return generateTwitchColor(username) || '#9146ff';
    }

    let color: string = colorTag;
    if (color.startsWith('#')) {
      // Already in hex format
    } else if (color.includes(',')) {
      // RGB format
      const rgb = color.split(',').map(c => parseInt(c.trim()));
      if (rgb.length >= 3 && rgb[0] !== undefined && rgb[1] !== undefined && rgb[2] !== undefined) {
        color = rgbToHex(rgb[0], rgb[1], rgb[2]);
      } else {
        color = '#9146ff';
      }
    }

    return color || '#9146ff';
  };

  const generateTwitchColor = (username: string): string => {
    const TWITCH_COLORS = [
      '#FF0000', '#0000FF', '#00FF00', '#B22222', '#FF7F50',
      '#9ACD32', '#FF4500', '#2E8B57', '#DAA520', '#D2691E',
      '#5F9EA0', '#1E90FF', '#FF69B4', '#8A2BE2', '#00FF7F',
      '#FF6347', '#40E0D0', '#EE82EE', '#F5DEB3', '#FFFFFF',
      '#F0E68C', '#DDA0DD', '#B0E0E6', '#FFB6C1', '#FFA07A',
      '#20B2AA', '#87CEEB', '#778899', '#B0C4DE', '#FFFFE0'
    ];

    if (!username) return '#9146ff';
    const name = username.toLowerCase();
    let hash = 0;
    
    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i);
      hash = hash & hash;
    }
    
    const colorIndex = Math.abs(hash) % TWITCH_COLORS.length;
    return TWITCH_COLORS[colorIndex] || '#9146ff';
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    r = Math.max(0, Math.min(255, Math.round(r)));
    g = Math.max(0, Math.min(255, Math.round(g)));
    b = Math.max(0, Math.min(255, Math.round(b)));
    
    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return "#" + toHex(r) + toHex(g) + toHex(b);
  };

  const parseBadges = (badgesString: string | undefined): string[] => {
    if (!badgesString) return [];
    
    const badges: string[] = [];
    const badgeList = badgesString.split(',');
    
    badgeList.forEach(badge => {
      const parts = badge.split('/');
      const type = parts[0];
      if (type && type.trim()) {
        badges.push(type);
      }
    });
    
    return badges;
  };

  const parseEmotes = (emotesString: string | undefined, message: string) => {
    if (!emotesString) return [];
    
    const emotes: Array<{ id: string; name: string; start: number; end: number }> = [];
    const emoteList = emotesString.split('/');
    
    emoteList.forEach(emoteData => {
      if (!emoteData) return;
      
      const [emoteId, positions] = emoteData.split(':');
      if (!positions || !emoteId) return;
      
      const positionList = positions.split(',');
      positionList.forEach(position => {
        const [startStr, endStr] = position.split('-');
        if (!startStr || !endStr) return;
        
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        
        if (isNaN(start) || isNaN(end)) return;
        
        const emoteName = message.substring(start, end + 1);
        
        emotes.push({
          id: emoteId,
          name: emoteName,
          start: start,
          end: end
        });
      });
    });
    
    // Sort emotes by position (right to left for proper replacement)
    emotes.sort((a, b) => b.start - a.start);
    
    return emotes;
  };

  const addMessage = (messageObj: ChatMessage) => {
    setMessages(prev => {
      const newMessages = [...prev, messageObj];
      
      // Cleanup old messages
      if (newMessages.length > finalConfig.maxMessages) {
        return newMessages.slice(-finalConfig.maxMessages);
      }
      
      return newMessages;
    });
  };

  const getContainerStyle = () => {
    const style: React.CSSProperties = {
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      background: finalConfig.enableBackground ? theme.colors.background : 'transparent',
      borderRadius: `${finalConfig.radius}px`,
      fontSize: `${16 * finalConfig.scale}px`,
    };

    if (finalConfig.enableBackground) {
      style.backdropFilter = 'blur(5px)';
    }

    return style;
  };

  const getHeaderStyle = () => ({
    background: theme.colors.headerBackground,
    padding: theme.spacing.headerPadding,
    display: finalConfig.showHeader ? 'flex' : 'none'
  });

  const getMessageStyle = (message: ChatMessage) => {
    const style: React.CSSProperties = {
      background: message.isSubscriber 
        ? 'rgba(145, 70, 255, 0.15)' 
        : message.isModerator 
        ? 'rgba(0, 255, 0, 0.15)' 
        : theme.colors.messageBackground,
      padding: theme.spacing.messagePadding,
      borderLeft: `2px dotted ${
        message.isSubscriber 
          ? '#9146ff' 
          : message.isModerator 
          ? '#00ff00' 
          : theme.colors.borderColor
      }`,
      color: theme.colors.textColor,
      fontSize: theme.fonts.size,
      fontFamily: theme.fonts.family,
      lineHeight: 1.3
    };

    if (finalConfig.enableMessageShadow) {
      style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }

    return style;
  };

  const getUsernameStyle = (message: ChatMessage) => {
    const mainColor = normalizeHex(message.color || '#9146ff');
    const darkerColor = getDarkerColor(mainColor);
    
    return {
      background: `linear-gradient(90deg, ${mainColor}, ${darkerColor})`,
      color: isColorBright(mainColor) ? '#222' : '#fff',
      textShadow: isColorBright(mainColor) 
        ? '0 1px 2px rgba(255,255,255,0.5)' 
        : '0 1px 2px rgba(0,0,0,0.3)'
    };
  };

  const normalizeHex = (hex: string): string => {
    hex = hex.replace('#', '').toLowerCase();
    if (hex.length === 3) {
      const r = hex[0];
      const g = hex[1];
      const b = hex[2];
      if (r && g && b) {
        hex = r + r + g + g + b + b;
      }
    }
    return '#' + hex.padEnd(6, 'f');
  };

  const getDarkerColor = (hex: string): string => {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    r = Math.round(r * 0.7);
    g = Math.round(g * 0.7);
    b = Math.round(b * 0.7);
    
    return rgbToHex(r, g, b);
  };

  const isColorBright = (hex: string): boolean => {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 0.7;
  };

  const renderMessage = (message: ChatMessage) => {
    const messageText = renderMessageWithEmotes(message.message, message.emotes);
    
    return (
      <div key={message.id} className="message" style={getMessageStyle(message)}>
        <span className="username-bubble" style={getUsernameStyle(message)}>
          {message.username}
        </span>
        <span className="message-text" style={{
          textShadow: finalConfig.enableTextShadow ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
        }}>
          {messageText}
        </span>
      </div>
    );
  };

  const renderMessageWithEmotes = (message: string, emotes: Array<{ id: string; name: string; start: number; end: number }>) => {
    if (!emotes || emotes.length === 0) {
      return message;
    }

    // Sort emotes by start position
    const sortedEmotes = [...emotes].sort((a, b) => a.start - b.start);
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    for (let i = 0; i < sortedEmotes.length; i++) {
      const emote = sortedEmotes[i];
      if (!emote) continue;
      
      // Add text before emote
      if (emote.start > lastIndex) {
        elements.push(message.substring(lastIndex, emote.start));
      }
      
      // Add emote image
      elements.push(
        <img
          key={`emote-${i}`}
          src={`https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/1.0`}
          alt={emote.name}
          title={emote.name}
          className="emote"
          style={{
            height: '2em',
            width: 'auto',
            verticalAlign: 'middle',
            margin: '0 1px',
            display: 'inline-block'
          }}
        />
      );
      
      lastIndex = emote.end + 1;
    }
    
    // Add remaining text
    if (lastIndex < message.length) {
      elements.push(message.substring(lastIndex));
    }

    return elements;
  };

  return (
    <div className="chat-container" style={getContainerStyle()}>
      <div className="chat-header" style={getHeaderStyle()}>
        <div className="header-left">
          <span>Twitch Chat</span>
        </div>
        <div className="header-right">
          <span className="status">{status}</span>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map(renderMessage)}
      </div>
    </div>
  );
}; 