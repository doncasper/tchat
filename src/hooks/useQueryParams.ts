import { useEffect, useCallback } from 'react'
import { useChatStore } from '../store/chatStore'
import { useUIStore } from '../store/uiStore'
import { useThemeStore } from '../store/themeStore'

// Short parameter names mapping - not used directly but kept for documentation
// const PARAM_MAPPING = {
//   ch: 'channel',
//   th: 'theme',
//   as: 'autoScroll',
//   ts: 'showTimestamps',
//   bd: 'showBadges',
//   fs: 'fontSizeMultiplier',
//   md: 'messageDelay',
//   mm: 'maxMessages'
// } as const

export const useQueryParams = () => {
  const chatStore = useChatStore()
  const uiStore = useUIStore()
  const themeStore = useThemeStore()
  
  // Read query params and update stores
  const syncFromURL = useCallback(() => {
    const params = new URLSearchParams(window.location.search)
    
    // Channel
    const channel = params.get('ch')
    if (channel && channel !== chatStore.currentChannel) {
      chatStore.setCurrentChannel(channel)
    }

    // Theme
    const theme = params.get('th')
    if (theme && themeStore.availableThemes.includes(theme)) {
      themeStore.switchTheme(theme)
    }

    // Boolean settings
    const autoScroll = params.get('as')
    if (autoScroll !== null) {
      chatStore.setAutoScroll(autoScroll === '1')
    }

    const showTimestamps = params.get('ts')
    if (showTimestamps !== null) {
      uiStore.setShowTimestamps(showTimestamps === '1')
    }

    const showBadges = params.get('bd')
    if (showBadges !== null) {
      uiStore.setShowBadges(showBadges === '1')
    }

    // Numeric settings
    const fontSizeMultiplier = params.get('fs')
    if (fontSizeMultiplier !== null) {
      const value = parseFloat(fontSizeMultiplier)
      if (!isNaN(value) && value >= 1 && value <= 2) {
        uiStore.setFontSizeMultiplier(value)
      }
    }

    const messageDelay = params.get('md')
    if (messageDelay !== null) {
      const value = parseInt(messageDelay, 10)
      if (!isNaN(value) && value >= 0 && value <= 50000) {
        chatStore.setMessageDelay(value)
      }
    }

    const maxMessages = params.get('mm')
    if (maxMessages !== null) {
      const value = parseInt(maxMessages, 10)
      if (!isNaN(value) && value >= 1 && value <= 200) {
        chatStore.setMaxMessages(value)
      }
    }
  }, [chatStore, uiStore, themeStore])

  // Update URL from current settings
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()

    // Only add non-default values to keep URL clean
    if (chatStore.currentChannel && chatStore.currentChannel !== 'lirik') {
      params.set('ch', chatStore.currentChannel)
    }
    if (themeStore.currentThemeName !== 'default') {
      params.set('th', themeStore.currentThemeName)
    }
    if (!chatStore.autoScroll) {
      params.set('as', '0')
    }
    if (!uiStore.showTimestamps) {
      params.set('ts', '0')
    }
    if (!uiStore.showBadges) {
      params.set('bd', '0')
    }
    if (uiStore.fontSizeMultiplier !== 1) {
      params.set('fs', uiStore.fontSizeMultiplier.toFixed(2))
    }
    if (chatStore.messageDelay !== 0) {
      params.set('md', chatStore.messageDelay.toString())
    }
    if (chatStore.maxMessages !== 100) {
      params.set('mm', chatStore.maxMessages.toString())
    }

    const newURL = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname

    window.history.replaceState({}, '', newURL)
  }, [
    chatStore.currentChannel,
    chatStore.autoScroll,
    chatStore.messageDelay,
    chatStore.maxMessages,
    themeStore.currentThemeName,
    uiStore.showTimestamps,
    uiStore.showBadges,
    uiStore.fontSizeMultiplier
  ])

  // Initialize from URL on mount
  useEffect(() => {
    syncFromURL()
  }, [syncFromURL])

  return { syncFromURL, updateURL }
}