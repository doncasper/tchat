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
  badgeDisplayMode: 'text' | 'image'
  fontSizeMultiplier: number
  borderRadius: number
  showHeader: boolean
  showBackground: boolean
  onlyFullyVisible: boolean
  hideCommandMessages: boolean
  
  // Actions
  toggleSettings: () => void
  toggleSidebar: () => void
  toggleFullscreen: () => void
  setShowTimestamps: (show: boolean) => void
  setShowBadges: (show: boolean) => void
  setBadgeDisplayMode: (mode: 'text' | 'image') => void
  setFontSizeMultiplier: (multiplier: number) => void
  setBorderRadius: (radius: number) => void
  setShowHeader: (show: boolean) => void
  setShowBackground: (show: boolean) => void
  setOnlyFullyVisible: (show: boolean) => void
  setHideCommandMessages: (hide: boolean) => void
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
        badgeDisplayMode: 'text',
        fontSizeMultiplier: 1,
        borderRadius: 0,
        showHeader: true,
        showBackground: true,
        onlyFullyVisible: false,
        hideCommandMessages: false,
        
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
        
        setBadgeDisplayMode: (mode) => set({ badgeDisplayMode: mode }),
        
        setFontSizeMultiplier: (multiplier) => set({ fontSizeMultiplier: multiplier }),
        
        setBorderRadius: (radius) => set({ borderRadius: radius }),
        
        setShowHeader: (show) => set({ showHeader: show }),
        
        setShowBackground: (show) => set({ showBackground: show }),
        
        setOnlyFullyVisible: (show) => set({ onlyFullyVisible: show }),
        
        setHideCommandMessages: (hide) => set({ hideCommandMessages: hide })
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          showTimestamps: state.showTimestamps,
          showBadges: state.showBadges,
          badgeDisplayMode: state.badgeDisplayMode,
          fontSizeMultiplier: state.fontSizeMultiplier,
          borderRadius: state.borderRadius,
          showHeader: state.showHeader,
          showBackground: state.showBackground,
          onlyFullyVisible: state.onlyFullyVisible,
          hideCommandMessages: state.hideCommandMessages
        })
      }
    ),
    {
      name: 'ui-store'
    }
  )
) 