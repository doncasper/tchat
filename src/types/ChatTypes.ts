// ChatDataItem represents a message or notification in the chat
export interface ChatDataItem {
  id: string
  type: 'message' | 'notification'
  text: string
  author: string
  badges?: string[]
  count?: number
} 