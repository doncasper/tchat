import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface UserFilterState {
  // User lists
  botUsers: string[] // Users whose messages should be converted to notifications
  blockedUsers: string[] // Users whose messages should be hidden
  
  // Actions
  addBotUser: (username: string) => void
  removeBotUser: (username: string) => void
  toggleBotUser: (username: string) => void
  addBlockedUser: (username: string) => void
  removeBlockedUser: (username: string) => void
  toggleBlockedUser: (username: string) => void
  clearBotUsers: () => void
  clearBlockedUsers: () => void
  
  // Computed
  isBotUser: (username: string) => boolean
  isBlockedUser: (username: string) => boolean
}

export const useUserFilterStore = create<UserFilterState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        botUsers: [],
        blockedUsers: [],
        
        // Actions
        addBotUser: (username) => set((state) => ({
          botUsers: state.botUsers.includes(username.toLowerCase()) 
            ? state.botUsers 
            : [...state.botUsers, username.toLowerCase()]
        })),
        
        removeBotUser: (username) => set((state) => ({
          botUsers: state.botUsers.filter(user => user !== username.toLowerCase())
        })),
        
        toggleBotUser: (username) => {
          const { botUsers } = get()
          const lowerUsername = username.toLowerCase()
          if (botUsers.includes(lowerUsername)) {
            get().removeBotUser(username)
          } else {
            get().addBotUser(username)
          }
        },
        
        addBlockedUser: (username) => set((state) => ({
          blockedUsers: state.blockedUsers.includes(username.toLowerCase()) 
            ? state.blockedUsers 
            : [...state.blockedUsers, username.toLowerCase()]
        })),
        
        removeBlockedUser: (username) => set((state) => ({
          blockedUsers: state.blockedUsers.filter(user => user !== username.toLowerCase())
        })),
        
        toggleBlockedUser: (username) => {
          const { blockedUsers } = get()
          const lowerUsername = username.toLowerCase()
          if (blockedUsers.includes(lowerUsername)) {
            get().removeBlockedUser(username)
          } else {
            get().addBlockedUser(username)
          }
        },
        
        clearBotUsers: () => set({ botUsers: [] }),
        
        clearBlockedUsers: () => set({ blockedUsers: [] }),
        
        // Computed
        isBotUser: (username) => {
          const { botUsers } = get()
          return botUsers.includes(username.toLowerCase())
        },
        
        isBlockedUser: (username) => {
          const { blockedUsers } = get()
          return blockedUsers.includes(username.toLowerCase())
        }
      }),
      {
        name: 'user-filter-storage'
      }
    ),
    {
      name: 'user-filter-store'
    }
  )
)