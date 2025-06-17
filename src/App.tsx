import { useState, useEffect, useRef } from 'react'
import { ThemeProvider, useTheme } from './themes/ThemeContext'
import type { ChatDataItem } from './types/ChatTypes'
import './App.css'

const chatDataItems: ChatDataItem[] = [
  {
    id: "1",
    type: 'message',
    text: "Hey everyone! How's the stream going?",
    author: "Alex",
    badges: ["moderator", "subscriber"]
  },
  {
    id: "2",
    type: 'message',
    text: "Just joined! This is amazing content 🔥",
    author: "Sarah",
    badges: []
  },
  {
    id: "3",
    type: 'message',
    text: "Can't believe we're already 2 hours in!",
    author: "Mike",
    badges: ["subscriber", "founder"]
  },
  {
    id: "4",
    type: 'message',
    text: "That last play was insane!",
    author: "Emma",
    badges: ["moderator"]
  },
  {
    id: "5",
    type: 'message',
    text: "Anyone else hyped for the next game?",
    author: "David",
    badges: []
  },
  {
    id: "6",
    type: 'message',
    text: "Thanks for the raid! Welcome everyone!",
    author: "Streamer",
    badges: ["broadcaster"]
  },
  {
    id: "7",
    type: 'message',
    text: "This community is the best 💙",
    author: "Lisa",
    badges: ["subscriber", "moderator"]
  },
  {
    id: "8",
    type: 'message',
    text: "Can we play that again?",
    author: "Tom",
    badges: ["viewer"]
  },
  {
    id: "9",
    type: 'notification',
    text: "Tom has subscribed!",
    author: "Tom",
    badges: ["subscriber"]
  },
  {
    id: "10",
    type: 'message',
    text: "Donation incoming! Keep up the great work!!!",
    author: "Chris",
    badges: ["vip", "subscriber"]
  },
  {
    id: "11",
    type: 'message',
    text: "The chat is moving so fast!",
    author: "Anna",
    badges: ["viewer"]
  },
  {
    id: "12",
    type: 'notification',
    text: "Anna raided with 1000 viewers!",
    author: "Anna",
    badges: [],
    count: 1000
  },
  {
    id: "13",
    type: 'notification',
    text: "Remember to follow and subscribe!",
    author: "ModBot",
    badges: ["moderator"]
  },
  {
    id: "14",
    type: 'message',
    text: "This is my first time here, loving it!",
    author: "NewUser",
    badges: ["viewer"]
  },
  {
    id: "15",
    type: 'message',
    text: "Can't wait for the next stream!",
    author: "Fan",
    badges: ["subscriber", "vip"]
  },
  {
    id: "16",
    type: 'message',
    text: "The energy in here is incredible!",
    author: "Maria",
    badges: ["moderator"]
  },
  {
    id: "17",
    type: 'message',
    text: "Thanks for the amazing stream everyone!",
    author: "Streamer",
    badges: ["broadcaster"]
  }
]

function ChatApp() {
  const [messages, setMessages] = useState<ChatDataItem[]>(chatDataItems)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { currentTheme, currentThemeName, availableThemes, switchTheme } = useTheme()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

  const handleSettingsClick = () => {
    console.log('Settings clicked')
    // TODO: Add opening settings component here!
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
    getBadgeText
  })

  return (
    <div className="chat-app">
      {HeaderComponent}
      {ChatComponent}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider initialTheme="default">
      <ChatApp />
    </ThemeProvider>
  )
}

export default App
