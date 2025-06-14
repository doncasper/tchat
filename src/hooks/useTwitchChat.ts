import { useState, useEffect, useRef } from 'react';
import type { ChatMessage, Badge, Emote } from '../types/chat';

interface UseTwitchChatOptions {
  channel: string;
  messageDuration?: number;
  maxMessages?: number;
}

export function useTwitchChat({ channel, messageDuration = 0, maxMessages = 20 }: UseTwitchChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState('Connecting...');
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const cleanupIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    let ws: WebSocket | null = null;

    const connectToChat = () => {
      try {
        ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
        wsRef.current = ws;

        ws.onopen = () => {
          ws?.send('CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands');
          ws?.send('NICK justinfan12345');
          ws?.send(`JOIN #${channel.toLowerCase()}`);
          if (isMounted) {
            console.log('Connected to chat:', channel.toLowerCase());
            setStatus(`Connected to ${channel}`);
            setIsConnected(true);
          }
        };

        ws.onmessage = (event) => {
          handleMessage(event.data);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          if (isMounted) {
            setStatus('Connection error');
            setIsConnected(false);
          }
        };

        ws.onclose = () => {
          if (isMounted) {
            setStatus('Disconnected');
            setIsConnected(false);
          }
        };
      } catch (error) {
        if (isMounted) setStatus('Connection failed');
      }
    };

    connectToChat();

    if (messageDuration > 0) {
      cleanupIntervalRef.current = window.setInterval(() => {
        const now = Date.now();
        setMessages(prev => {
          const validMessages = prev.filter(msg => {
            const messageAge = now - msg.timestamp.getTime();
            return messageAge < messageDuration;
          });
          return validMessages;
        });
      }, 5000);
    }

    return () => {
      isMounted = false;
      if (wsRef.current && wsRef.current.readyState === 1) {
        console.log('Closing WebSocket');
        wsRef.current.close();
      }
      wsRef.current = null;
      if (cleanupIntervalRef.current) clearInterval(cleanupIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, messageDuration]);

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
      type: 'message',
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

    setMessages(prev => {
      const newMessages = [...prev, messageObj];
      const max = maxMessages ?? 35;
      if (newMessages.length > max) {
        return newMessages.slice(-max);
      }
      return newMessages;
    });
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

  const parseBadges = (badgesString: string | undefined): Badge[] => {
    if (!badgesString) return [];
    const badges: Badge[] = [];
    const badgeList = badgesString.split(',');
    badgeList.forEach(badge => {
      const parts = badge.split('/');
      const type = parts[0];
      const version = parts[1] || '1';
      if (type && type.trim()) {
        badges.push({
          type: type.trim(),
          version,
          url: `https://static-cdn.jtvnw.net/badges/v2/${type}/default/dark/1.0`
        });
      }
    });
    return badges;
  };

  const parseEmotes = (emotesString: string | undefined, message: string): Emote[] => {
    if (!emotesString) return [];
    const emotes: Emote[] = [];
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
          end: end,
          url: `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/1.0`
        });
      });
    });
    emotes.sort((a, b) => b.start - a.start);
    return emotes;
  };

  return { messages, status, isConnected };
} 