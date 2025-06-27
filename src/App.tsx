import { useEffect, useRef, useState } from 'react'
import { useChatStore } from './store/chatStore'
import { useThemeStore } from './store/themeStore'
import { useUIStore } from './store/uiStore'
import { useThemeInitializer } from './store/useThemeInitializer'
import { useAnimationStyles } from './hooks/useAnimationStyles'
import { useTwitchChat } from './hooks/useTwitchChat'
import { Settings } from './components/Settings/Settings'
import './App.css'


function ChatApp() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [channelInput, setChannelInput] = useState('')
  const [showChannelInput, setShowChannelInput] = useState(false)
  
  // Initialize theme
  useThemeInitializer()
  
  // Initialize animations
  useAnimationStyles()
  
  // Zustand stores
  const {
    messages,
    autoScroll,
    connectionStatus,
    currentChannel,
    setCurrentChannel,
  } = useChatStore()

  const {
    currentTheme,
    currentThemeName,
    availableThemes,
    switchTheme
  } = useThemeStore()

  const {
    isSettingsOpen,
    toggleSettings
  } = useUIStore()

  // Initialize WebSocket connection
  const { changeChannel } = useTwitchChat({
    channel: currentChannel,
    autoConnect: true
  })

  const scrollToBottom = () => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, autoScroll])

  const handleChannelSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedChannel = channelInput.trim()
    if (trimmedChannel && trimmedChannel !== currentChannel) {
      setCurrentChannel(trimmedChannel)
      changeChannel(trimmedChannel)
      setChannelInput('')
      setShowChannelInput(false)
    }
  }

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

  const handleSettingsClick = () => {
    toggleSettings()
  }

  const handleThemeSwitch = (themeName: string) => {
    switchTheme(themeName)
  }

  // Render theme components
  const HeaderComponent = currentTheme.Header.render({
    streamTitle: `${currentChannel}'s Chat`,
    viewerCount: messages.length,
    onSettingsClick: handleSettingsClick,
    onThemeSwitch: handleThemeSwitch,
    currentTheme: currentThemeName,
    availableThemes
  })

  const ChatComponent = currentTheme.Chat.render({
    messages,
    messagesEndRef,
    getBadgeText,
  })

  return (
    <div className="chat-app">
      {HeaderComponent}
      <div className="connection-status-bar" style={{
        padding: '8px 16px',
        backgroundColor: connectionStatus.includes('Connected') ? '#00b300' : '#ff4444',
        color: 'white',
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>{connectionStatus}</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {showChannelInput ? (
            <form onSubmit={handleChannelSubmit} style={{ display: 'flex', gap: '4px' }}>
              <input
                type="text"
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                placeholder="Channel name"
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '14px'
                }}
                autoFocus
              />
              <button type="submit" style={{
                padding: '4px 12px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'white',
                color: '#333',
                cursor: 'pointer',
                fontSize: '14px'
              }}>Join</button>
              <button type="button" onClick={() => setShowChannelInput(false)} style={{
                padding: '4px 12px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}>Cancel</button>
            </form>
          ) : (
            <button onClick={() => setShowChannelInput(true)} style={{
              padding: '4px 12px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}>Change Channel</button>
          )}
        </div>
      </div>
      {ChatComponent}
      <Settings isOpen={isSettingsOpen} onClose={toggleSettings} />
    </div>
  )
}

function App() {
  return <ChatApp />
}

export default App
