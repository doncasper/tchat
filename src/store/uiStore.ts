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
  fontSizeMultiplier: number
  
  // Actions
  toggleSettings: () => void
  toggleSidebar: () => void
  toggleFullscreen: () => void
  setShowTimestamps: (show: boolean) => void
  setShowBadges: (show: boolean) => void
  setFontSizeMultiplier: (multiplier: number) => void
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
        fontSizeMultiplier: 1,
        
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
        
        setFontSizeMultiplier: (multiplier) => set({ fontSizeMultiplier: multiplier })
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          showTimestamps: state.showTimestamps,
          showBadges: state.showBadges,
          fontSizeMultiplier: state.fontSizeMultiplier
        })
      }
    ),
    {
      name: 'ui-store'
    }
  )
) 