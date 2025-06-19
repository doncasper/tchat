// ChatDataItem represents a message or notification in the chat
export interface ChatDataItem {
  id: string
  type: 'message' | 'notification'
  text: string
  nickname: string
  userType?: 'subscriber' | 'moderator' | 'broadcaster' | 'vip' | 'admin' | 'staff' | 'partner' | 'founder' | 'super_moderator' | 'global_moderator' | 'turbo' | 'bot'
  time: Date
  badges?: string[]
  count?: number
} 