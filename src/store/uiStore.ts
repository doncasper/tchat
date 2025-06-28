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
  compactMode: boolean
  fontSize: 'small' | 'medium' | 'large'
  
  // Actions
  toggleSettings: () => void
  toggleSidebar: () => void
  toggleFullscreen: () => void
  setShowTimestamps: (show: boolean) => void
  setShowBadges: (show: boolean) => void
  setCompactMode: (compact: boolean) => void
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
        compactMode: false,
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
        
        setCompactMode: (compact) => set({ compactMode: compact }),
        
        setFontSize: (size) => set({ fontSize: size })
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          showTimestamps: state.showTimestamps,
          showBadges: state.showBadges,
          compactMode: state.compactMode,
          fontSize: state.fontSize
        })
      }
    ),
    {
      name: 'ui-store'
    }
  )
) 