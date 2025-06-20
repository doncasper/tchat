// ChatDataItem represents a message or notification in the chat
export interface ChatDataItem {
  id: string
  type: 'message' | 'notification'
  text: string
  nickname: string
  userType?: 'broadcaster' | 'moderator' | 'subscriber' | 'vip' | 'staff' | 'partner' | 'founder' | 'artist' | 'dj' | 'turbo' | 'bot'
  time: Date
  badges?: string[]
  count?: number
} 