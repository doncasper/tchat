import { useEffect, useRef } from 'react'
import { useChatStore } from './store/chatStore'
import { useThemeStore } from './store/themeStore'
import { useUIStore } from './store/uiStore'
import { useThemeInitializer } from './store/useThemeInitializer'
import { useTwitchChat } from './hooks/useTwitchChat'
import { readSettingsFromURL } from './utils/urlParams'
import { Settings } from './components/Settings/Settings'
import './App.css'


function ChatApp() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Initialize theme
  useThemeInitializer()
  
  // Initialize settings from URL params on mount
  useEffect(() => {
    const urlSettings = readSettingsFromURL()
    
    // Apply settings from URL if present
    if (urlSettings.channel) {
      useChatStore.getState().setCurrentChannel(urlSettings.channel)
    }
    if (urlSettings.theme) {
      useThemeStore.getState().switchTheme(urlSettings.theme)
    }
    if (urlSettings.showTimestamps !== null) {
      useUIStore.getState().setShowTimestamps(urlSettings.showTimestamps)
    }
    if (urlSettings.showBadges !== null) {
      useUIStore.getState().setShowBadges(urlSettings.showBadges)
    }
    if (urlSettings.fontSizeMultiplier) {
      useUIStore.getState().setFontSizeMultiplier(urlSettings.fontSizeMultiplier)
    }
    if (urlSettings.messageDelay !== null) {
      useChatStore.getState().setMessageDelay(urlSettings.messageDelay)
    }
    if (urlSettings.maxMessages !== null) {
      useChatStore.getState().setMaxMessages(urlSettings.maxMessages)
    }
  }, [])
  
  // Zustand stores
  const {
    messages,
    connectionStatus,
    currentChannel,
  } = useChatStore()

  const {
    currentTheme,
    currentThemeName,
    availableThemes,
    switchTheme
  } = useThemeStore()

  const {
    isSettingsOpen,
    borderRadius,
    toggleSettings
  } = useUIStore()

  // Initialize WebSocket connection
  const { changeChannel } = useTwitchChat({
    channel: currentChannel,
    autoConnect: true
  })

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Add keyboard shortcut for settings modal (Ctrl+M)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'm') {
        // Prevent default browser behavior
        event.preventDefault()
        // Don't trigger if user is typing in an input/textarea
        const activeElement = document.activeElement
        if (activeElement && (
          activeElement.tagName === 'INPUT' || 
          activeElement.tagName === 'TEXTAREA' || 
          activeElement.getAttribute('contenteditable') === 'true'
        )) {
          return
        }
        toggleSettings()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [toggleSettings])


  const getBadgeText = (badge: string) => {
    switch (badge) {
      case 'moderator': return 'MOD'
      case 'subscriber': return 'SUB'
      case 'vip': return 'VIP'
      case 'broadcaster': return 'STREAMER'
      case 'verified': return 'VERIFIED'
      case 'founder': return 'FOUNDER'
      case 'staff': return 'STAFF'
      case 'admin': return 'ADMIN'
      case 'global_mod': return 'GLOBAL MOD'
      case 'premium': return 'PREMIUM'
      default: return ''
    }
  }

  const getUserType = (badges: string[]) => {
    if (badges.includes('broadcaster')) return 'broadcaster'
    if (badges.includes('moderator')) return 'moderator'
    if (badges.includes('vip')) return 'vip'
    if (badges.includes('subscriber')) return 'subscriber'
    if (badges.includes('founder')) return 'founder'
    if (badges.includes('staff')) return 'staff'
    if (badges.includes('admin')) return 'admin'
    if (badges.includes('global_mod')) return 'global_mod'
    return ''
  }

  const handleSettingsClick = () => {
    toggleSettings()
  }

  const handleThemeSwitch = (themeName: string) => {
    switchTheme(themeName)
  }

  // Render theme components
  const HeaderComponent = currentTheme.Header.render
  const headerProps = {
    streamTitle: `${currentChannel}'s Chat`,
    viewerCount: messages.length,
    connectionStatus,
    onSettingsClick: handleSettingsClick,
    onThemeSwitch: handleThemeSwitch,
    currentTheme: currentThemeName,
    availableThemes
  }

  const ChatComponent = currentTheme.Chat.render
  const chatProps = {
    messages,
    messagesEndRef,
    getBadgeText,
    getUserType
  }

  return (
    <div className="chat-app" style={{ borderRadius: `${borderRadius}px`, overflow: 'hidden' }}>
      <HeaderComponent {...headerProps} />
      <ChatComponent {...chatProps} />
      <Settings 
        isOpen={isSettingsOpen} 
        onClose={toggleSettings}
        changeChannel={changeChannel}
      />
    </div>
  )
}

function App() {
  return <ChatApp />
}

export default App
