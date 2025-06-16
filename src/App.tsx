import { useState, useEffect, useRef } from 'react'
import './App.css'

interface Message {
  message_id: string
  message_text: string
  author: string
  badges: string[]
}

const hardcodedMessages: Message[] = [
  {
    message_id: "1",
    message_text: "Hey everyone! How's the stream going?",
    author: "Alex",
    badges: ["moderator", "subscriber"]
  },
  {
    message_id: "2",
    message_text: "Just joined! This is amazing content 🔥",
    author: "Sarah",
    badges: ["viewer"]
  },
  {
    message_id: "3",
    message_text: "Can't believe we're already 2 hours in!",
    author: "Mike",
    badges: ["subscriber", "vip"]
  },
  {
    message_id: "4",
    message_text: "That last play was insane!",
    author: "Emma",
    badges: ["moderator"]
  },
  {
    message_id: "5",
    message_text: "Anyone else hyped for the next game?",
    author: "David",
    badges: ["viewer"]
  },
  {
    message_id: "6",
    message_text: "Thanks for the raid! Welcome everyone!",
    author: "Streamer",
    badges: ["broadcaster"]
  },
  {
    message_id: "7",
    message_text: "This community is the best 💙",
    author: "Lisa",
    badges: ["subscriber", "moderator"]
  },
  {
    message_id: "8",
    message_text: "Can we play that again?",
    author: "Tom",
    badges: ["viewer"]
  },
  {
    message_id: "9",
    message_text: "Donation incoming! Keep up the great work!",
    author: "Chris",
    badges: ["donor", "subscriber"]
  },
  {
    message_id: "10",
    message_text: "The chat is moving so fast!",
    author: "Anna",
    badges: ["viewer"]
  },
  {
    message_id: "11",
    message_text: "Remember to follow and subscribe!",
    author: "ModBot",
    badges: ["bot", "moderator"]
  },
  {
    message_id: "12",
    message_text: "This is my first time here, loving it!",
    author: "NewUser",
    badges: ["viewer"]
  },
  {
    message_id: "13",
    message_text: "Can't wait for the next stream!",
    author: "Fan",
    badges: ["subscriber", "vip"]
  },
  {
    message_id: "14",
    message_text: "The energy in here is incredible!",
    author: "Maria",
    badges: ["moderator"]
  },
  {
    message_id: "15",
    message_text: "Thanks for the amazing stream everyone!",
    author: "Streamer",
    badges: ["broadcaster"]
  }
]

function App() {
  const [messages, setMessages] = useState<Message[]>(hardcodedMessages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'broadcaster': return '#ff6b6b'
      case 'moderator': return '#006400'
      case 'subscriber': return '#45b7d1'
      case 'vip': return '#f9ca24'
      case 'donor': return '#ff9ff3'
      case 'bot': return '#a55eea'
      default: return '#95a5a6'
    }
  }

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'broadcaster': return '📺'
      case 'moderator': return '🛡️'
      case 'subscriber': return '💎'
      case 'vip': return '👑'
      case 'donor': return '💝'
      case 'bot': return '🤖'
      default: return '👤'
    }
  }

  return (
    <div className="chat-app">
      <header className="chat-header">
        <div className="header-content">
          <div className="stream-info">
            <h1>Live Stream Chat with Twitch</h1>
            <div className="stream-status">
              <span className="live-indicator">● LIVE</span>
              <span className="viewer-count">1,234 viewers</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="settings-btn">⚙️</button>
          </div>
        </div>
      </header>

      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.message_id} className="message">
              <div className="message-header">
                <div className="author-info">
                  <span className="author-name">{message.author}</span>
                  <div className="badges">
                    {message.badges.map((badge, index) => (
                      <span
                        key={index}
                        className="badge"
                        style={{ backgroundColor: getBadgeColor(badge) }}
                        title={badge}
                      >
                        {getBadgeIcon(badge)}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="message-time">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="message-content">
                {message.message_text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}

export default App
