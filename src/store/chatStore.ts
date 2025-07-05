import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { ChatDataItem } from '../types/ChatTypes'

interface ChatState {
  // Messages
  messages: ChatDataItem[]
  currentMessageIndex: number
  isLoading: boolean
  error: string | null
  
  // Connection state
  connectionStatus: string
  currentChannel: string
  
  // Chat settings
  maxMessages: number
  disappearingDelay: number // Time in ms before messages disappear (0 = disabled)
  
  // Actions
  addMessage: (message: ChatDataItem) => void
  addMessages: (messages: ChatDataItem[]) => void
  clearMessages: () => void
  setCurrentMessageIndex: (index: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setConnectionStatus: (status: string) => void
  setCurrentChannel: (channel: string) => void
  setMaxMessages: (max: number) => void
  setDisappearingDelay: (delay: number) => void
  removeMessage: (messageId: string) => void
  
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
        connectionStatus: 'Disconnected',
        currentChannel: 'takotoken',
        maxMessages: 15,
        disappearingDelay: 0,
        
        // Actions
        addMessage: (message) => set((state) => {
          // Check for duplicate messages (same id or same content within 1 second)
          const isDuplicate = state.messages.some(existingMessage => 
            existingMessage.id === message.id ||
            (existingMessage.text === message.text && 
             existingMessage.nickname === message.nickname &&
             Math.abs(new Date(existingMessage.time).getTime() - new Date(message.time).getTime()) < 1000)
          )
          
          if (isDuplicate) {
            console.log('Duplicate message detected, skipping:', message)
            return state
          }
          
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
        
        setConnectionStatus: (status) => set({ connectionStatus: status }),
        
        setCurrentChannel: (channel) => set({ currentChannel: channel }),
        
        setMaxMessages: (max) => set({ maxMessages: max }),
        
        setDisappearingDelay: (delay) => set({ disappearingDelay: delay }),
        
        removeMessage: (messageId) => set((state) => ({
          messages: state.messages.filter(msg => msg.id !== messageId)
        })),
        
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
          maxMessages: state.maxMessages,
          currentChannel: state.currentChannel,
          disappearingDelay: state.disappearingDelay
        })
      }
    ),
    {
      name: 'chat-store'
    }
  )
) 