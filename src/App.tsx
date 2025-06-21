import { useEffect, useRef } from 'react'
import { useChatStore } from './store/chatStore'
import { useThemeStore } from './store/themeStore'
import { useUIStore } from './store/uiStore'
import { useThemeInitializer } from './store/useThemeInitializer'
import { Settings } from './components/Settings/Settings'
import type { ChatDataItem } from './types/ChatTypes'
import './App.css'

const chatDataItems: ChatDataItem[] = [
  {
    id: "1",
    type: 'message',
    text: "Hey everyone! How's the stream going?",
    nickname: "Alex",
    userType: "moderator",
    time: new Date(),
    badges: ["moderator", "subscriber"]
  },
  {
    id: "2",
    type: 'message',
    text: "Just joined! This is amazing content 🔥",
    nickname: "Sarah",
    time: new Date(),
    badges: []
  },
  {
    id: "3",
    type: 'message',
    text: "Can't believe we're already 2 hours in!",
    nickname: "Mike",
    userType: "subscriber",
    time: new Date(),
    badges: ["subscriber", "founder"]
  },
  {
    id: "4",
    type: 'message',
    text: "That last play was insane!",
    nickname: "Emma",
    userType: "moderator",
    time: new Date(),
    badges: ["moderator"]
  },
  {
    id: "5",
    type: 'message',
    text: "Anyone else hyped for the next game?",
    nickname: "David",
    time: new Date(),
    badges: []
  },
  {
    id: "6",
    type: 'message',
    text: "Thanks for the raid! Welcome everyone!",
    nickname: "Streamer",
    userType: "broadcaster",
    time: new Date(),
    badges: ["broadcaster"]
  },
  {
    id: "7",
    type: 'message',
    text: "This community is the best 💙",
    nickname: "Lisa",
    userType: "moderator",
    time: new Date(),
    badges: ["subscriber", "moderator"]
  },
  {
    id: "8",
    type: 'message',
    text: "Lorem ipsum refers to placeholder text often used in publishing and graphic design to demonstrate the visual style of a document, webpage, or typeface. It is intended to serve as a sample, not to be read as meaningful sentences.",
    nickname: "Tom",
    userType: "subscriber",
    time: new Date(),
    badges: ['subscriber']
  },
  {
    id: "9",
    type: 'notification',
    text: "Tom has subscribed!",
    nickname: "Tom",
    userType: "subscriber",
    time: new Date(),
    badges: ["subscriber"]
  },
  {
    id: "10",
    type: 'message',
    text: "Donation incoming! Keep up the great work!!!",
    nickname: "Chris",
    userType: "vip",
    time: new Date(),
    badges: ["vip", "subscriber"]
  },
  {
    id: "11",
    type: 'message',
    text: "The chat is moving so fast!",
    nickname: "Anna",
    userType: "subscriber",
    time: new Date(),
    badges: ["subscriber"]
  },
  {
    id: "12",
    type: 'notification',
    text: "Anna raided with 1000 viewers!",
    nickname: "Anna",
    time: new Date(),
    badges: [],
    count: 1000
  },
  {
    id: "13",
    type: 'notification',
    text: "Remember to follow and subscribe!",
    nickname: "ModBot",
    userType: "bot",
    time: new Date(),
    badges: ["moderator"]
  },
  {
    id: "14",
    type: 'message',
    text: "This is my first time here, loving it!",
    nickname: "NewUser",
    time: new Date(),
    badges: []
  },
  {
    id: "15",
    type: 'message',
    text: "Can't wait for the next stream!",
    nickname: "Fan",
    userType: "vip",
    time: new Date(),
    badges: ["subscriber", "vip"]
  },
  {
    id: "16",
    type: 'message',
    text: "The energy in here is incredible!",
    nickname: "Maria",
    userType: "moderator",
    time: new Date(),
    badges: ["moderator"]
  },
  {
    id: "17",
    type: 'message',
    text: "Thanks for the amazing stream everyone!",
    nickname: "Streamer",
    userType: "broadcaster",
    time: new Date(),
    badges: ["broadcaster"]
  }
]

function ChatApp() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Initialize theme
  useThemeInitializer()
  
  // Zustand stores
  const {
    messages,
    currentMessageIndex,
    messageDelay,
    autoScroll,
    addMessage,
    setCurrentMessageIndex
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

  const scrollToBottom = () => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, autoScroll])

  // Add messages one by one with a timer
  useEffect(() => {
    if (currentMessageIndex < chatDataItems.length) {
      const timer = setTimeout(() => {
        const nextMessage = chatDataItems[currentMessageIndex]
        if (nextMessage) {
          addMessage(nextMessage)
        }
        setCurrentMessageIndex(currentMessageIndex + 1)
      }, messageDelay)

      return () => clearTimeout(timer)
    }
  }, [currentMessageIndex, messageDelay, addMessage, setCurrentMessageIndex])

  const getBadgeText = (badge: string) => {
    switch (badge) {
      case 'moderator': return 'MOD'
      case 'subscriber': return 'SUB'
      case 'vip': return 'VIP'
      case 'broadcaster': return 'BROADCASTER'
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
    if (badges.includes('vip')) return 'vip'
    if (badges.includes('subscriber')) return 'subscriber'
    return ''
  }

  const handleSettingsClick = () => {
    toggleSettings()
  }

  const handleThemeSwitch = (themeName: string) => {
    switchTheme(themeName)
  }

  // Render theme components
  const HeaderComponent = currentTheme.Header.render({
    streamTitle: "Live Stream Chat with Streamer",
    viewerCount: 1234,
    onSettingsClick: handleSettingsClick,
    onThemeSwitch: handleThemeSwitch,
    currentTheme: currentThemeName,
    availableThemes
  })

  const ChatComponent = currentTheme.Chat.render({
    messages,
    messagesEndRef,
    getBadgeText,
    getUserType
  })

  return (
    <div className="chat-app">
      {HeaderComponent}
      {ChatComponent}
      <Settings isOpen={isSettingsOpen} onClose={toggleSettings} />
    </div>
  )
}

function App() {
  return <ChatApp />
}

export default App
