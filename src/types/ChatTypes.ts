// ChatDataItem represents a message or notification in the chat
export interface ChatDataItem {
  id: string
  type: 'message' | 'notification'
  notificationType?: 'alert' | 'sub_gift' | 'sub' | 'cheer' | 'follow' | 'host' | 'raid' | 'bits'
  text: string
  nickname: string
  color?: string
  userType?: 'broadcaster' | 'moderator' | 'subscriber' | 'vip' | 'staff' | 'partner' | 'founder' | 'artist' | 'dj' | 'turbo' | 'bot'
  time: Date
  badges?: string[]
  count?: number
} 