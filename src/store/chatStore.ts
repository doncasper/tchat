import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { ChatDataItem } from '../types/ChatTypes'

interface ChatState {
  // Messages
  messages: ChatDataItem[]
  currentMessageIndex: number
  isLoading: boolean
  error: string | null
  
  // Chat settings
  autoScroll: boolean
  messageDelay: number
  maxMessages: number
  
  // Actions
  addMessage: (message: ChatDataItem) => void
  addMessages: (messages: ChatDataItem[]) => void
  clearMessages: () => void
  setCurrentMessageIndex: (index: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setAutoScroll: (autoScroll: boolean) => void
  setMessageDelay: (delay: number) => void
  setMaxMessages: (max: number) => void
  
  // Computed actions
  getMessagesByType: (type: 'message' | 'notification') => ChatDataItem[]
  getMessagesByUser: (nickname: string) => ChatDataItem[]
  getRecentMessages: (count: number) => ChatDataItem[]
}

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        messages: [],
        currentMessageIndex: 0,
        isLoading: false,
        error: null,
        autoScroll: true,
        messageDelay: 1000,
        maxMessages: 1000,
        
        // Actions
        addMessage: (message) => set((state) => {
          const newMessages = [...state.messages, message]
          
          // Remove old messages if we exceed maxMessages
          if (newMessages.length > state.maxMessages) {
            newMessages.splice(0, newMessages.length - state.maxMessages)
          }
          
          return { messages: newMessages }
        }),
        
        addMessages: (messages) => set((state) => {
          const newMessages = [...state.messages, ...messages]
          
          // Remove old messages if we exceed maxMessages
          if (newMessages.length > state.maxMessages) {
            newMessages.splice(0, newMessages.length - state.maxMessages)
          }
          
          return { messages: newMessages }
        }),
        
        clearMessages: () => set({ messages: [], currentMessageIndex: 0 }),
        
        setCurrentMessageIndex: (index) => set({ currentMessageIndex: index }),
        
        setLoading: (loading) => set({ isLoading: loading }),
        
        setError: (error) => set({ error }),
        
        setAutoScroll: (autoScroll) => set({ autoScroll }),
        
        setMessageDelay: (delay) => set({ messageDelay: delay }),
        
        setMaxMessages: (max) => set({ maxMessages: max }),
        
        // Computed actions
        getMessagesByType: (type) => {
          const { messages } = get()
          return messages.filter(msg => msg.type === type)
        },
        
        getMessagesByUser: (nickname) => {
          const { messages } = get()
          return messages.filter(msg => msg.nickname === nickname)
        },
        
        getRecentMessages: (count) => {
          const { messages } = get()
          return messages.slice(-count)
        }
      }),
      {
        name: 'chat-storage',
        partialize: (state) => ({
          autoScroll: state.autoScroll,
          messageDelay: state.messageDelay,
          maxMessages: state.maxMessages
        })
      }
    ),
    {
      name: 'chat-store'
    }
  )
) 