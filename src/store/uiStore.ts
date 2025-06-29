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
  borderRadius: number
  showHeader: boolean
  showBackground: boolean
  
  // Actions
  toggleSettings: () => void
  toggleSidebar: () => void
  toggleFullscreen: () => void
  setShowTimestamps: (show: boolean) => void
  setShowBadges: (show: boolean) => void
  setFontSizeMultiplier: (multiplier: number) => void
  setBorderRadius: (radius: number) => void
  setShowHeader: (show: boolean) => void
  setShowBackground: (show: boolean) => void
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
        borderRadius: 0,
        showHeader: true,
        showBackground: true,
        
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
        
        setFontSizeMultiplier: (multiplier) => set({ fontSizeMultiplier: multiplier }),
        
        setBorderRadius: (radius) => set({ borderRadius: radius }),
        
        setShowHeader: (show) => set({ showHeader: show }),
        
        setShowBackground: (show) => set({ showBackground: show })
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          showTimestamps: state.showTimestamps,
          showBadges: state.showBadges,
          fontSizeMultiplier: state.fontSizeMultiplier,
          borderRadius: state.borderRadius,
          showHeader: state.showHeader,
          showBackground: state.showBackground
        })
      }
    ),
    {
      name: 'ui-store'
    }
  )
) 