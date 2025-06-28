import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface UIState {
  // UI state
  isSettingsOpen: boolean
  isSidebarOpen: boolean
  isFullscreen: boolean
  
  // Display preferences
  showTimestamps: boolean
  showBadges: boolean
  fontSize: 'small' | 'medium' | 'large'
  
  // Actions
  toggleSettings: () => void
  toggleSidebar: () => void
  toggleFullscreen: () => void
  setShowTimestamps: (show: boolean) => void
  setShowBadges: (show: boolean) => void
  setFontSize: (size: 'small' | 'medium' | 'large') => void
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        isSettingsOpen: false,
        isSidebarOpen: false,
        isFullscreen: false,
        showTimestamps: true,
        showBadges: true,
        fontSize: 'medium',
        
        // Actions
        toggleSettings: () => set((state) => ({ 
          isSettingsOpen: !state.isSettingsOpen 
        })),
        
        toggleSidebar: () => set((state) => ({ 
          isSidebarOpen: !state.isSidebarOpen 
        })),
        
        toggleFullscreen: () => set((state) => ({ 
          isFullscreen: !state.isFullscreen 
        })),
        
        setShowTimestamps: (show) => set({ showTimestamps: show }),
        
        setShowBadges: (show) => set({ showBadges: show }),
        
        setFontSize: (size) => set({ fontSize: size })
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          showTimestamps: state.showTimestamps,
          showBadges: state.showBadges,
          fontSize: state.fontSize
        })
      }
    ),
    {
      name: 'ui-store'
    }
  )
) 