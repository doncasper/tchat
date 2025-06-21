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
  
  // Animation settings
  enableAnimations: boolean
  animationSpeed: 'slow' | 'normal' | 'fast'
  
  // Actions
  toggleSettings: () => void
  toggleSidebar: () => void
  toggleFullscreen: () => void
  setShowTimestamps: (show: boolean) => void
  setShowBadges: (show: boolean) => void
  setCompactMode: (compact: boolean) => void
  setFontSize: (size: 'small' | 'medium' | 'large') => void
  setEnableAnimations: (enable: boolean) => void
  setAnimationSpeed: (speed: 'slow' | 'normal' | 'fast') => void
  
  // Computed
  getAnimationDuration: () => number
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isSettingsOpen: false,
        isSidebarOpen: false,
        isFullscreen: false,
        showTimestamps: true,
        showBadges: true,
        compactMode: false,
        fontSize: 'medium',
        enableAnimations: true,
        animationSpeed: 'normal',
        
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
        
        setFontSize: (size) => set({ fontSize: size }),
        
        setEnableAnimations: (enable) => set({ enableAnimations: enable }),
        
        setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
        
        // Computed
        getAnimationDuration: () => {
          const { animationSpeed, enableAnimations } = get()
          
          if (!enableAnimations) return 0
          
          switch (animationSpeed) {
            case 'slow': return 500
            case 'fast': return 150
            default: return 300
          }
        }
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          showTimestamps: state.showTimestamps,
          showBadges: state.showBadges,
          compactMode: state.compactMode,
          fontSize: state.fontSize,
          enableAnimations: state.enableAnimations,
          animationSpeed: state.animationSpeed
        })
      }
    ),
    {
      name: 'ui-store'
    }
  )
) 