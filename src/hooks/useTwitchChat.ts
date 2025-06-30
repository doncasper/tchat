import { useEffect, useRef, useCallback } from 'react'
import { TwitchWebSocket } from '../services/twitchWebSocket'
import { useChatStore } from '../store/chatStore'
import { useUserFilterStore } from '../store/userFilterStore'
import type { ChatDataItem } from '../types/ChatTypes'

interface UseTwitchChatOptions {
  channel?: string
  autoConnect?: boolean
}

// WebSocket manager singleton
class WebSocketManager {
  private static instance: WebSocketManager | null = null
  private webSocket: TwitchWebSocket | null = null
  private subscribers: Set<(message: ChatDataItem) => void> = new Set()
  private statusSubscribers: Set<(status: string) => void> = new Set()
  private currentChannel: string = ''

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager()
    }
    return WebSocketManager.instance
  }

  subscribe(onMessage: (message: ChatDataItem) => void, onStatusChange: (status: string) => void) {
    this.subscribers.add(onMessage)
    this.statusSubscribers.add(onStatusChange)
    
    return () => {
      this.subscribers.delete(onMessage)
      this.statusSubscribers.delete(onStatusChange)
      
      // Clean up if no more subscribers
      if (this.subscribers.size === 0 && this.webSocket) {
        this.webSocket.disconnect()
        this.webSocket = null
        this.currentChannel = ''
      }
    }
  }

  connect(channel: string) {
    if (this.webSocket && this.currentChannel === channel) {
      return // Already connected to this channel
    }

    if (this.webSocket && this.currentChannel !== channel) {
      this.webSocket.changeChannel(channel)
      this.currentChannel = channel
      return
    }

    if (!this.webSocket) {
      this.webSocket = new TwitchWebSocket({
        channel,
        onMessage: (message) => {
          this.subscribers.forEach(callback => callback(message))
        },
        onStatusChange: (status) => {
          this.statusSubscribers.forEach(callback => callback(status))
        },
        onConnect: () => {
          console.log('WebSocket connected via manager')
        },
        onDisconnect: () => {
          console.log('WebSocket disconnected via manager')
        }
      })
      this.webSocket.connect()
      this.currentChannel = channel
    }
  }

  disconnect() {
    if (this.webSocket) {
      this.webSocket.disconnect()
      this.webSocket = null
      this.currentChannel = ''
    }
  }

  changeChannel(channel: string) {
    if (this.webSocket && this.currentChannel !== channel) {
      this.webSocket.changeChannel(channel)
      this.currentChannel = channel
    }
  }
}

export const useTwitchChat = (options: UseTwitchChatOptions = {}) => {
  const { 
    channel = 'takotoken', 
    autoConnect = true 
  } = options

  const { addMessage, setConnectionStatus, clearMessages } = useChatStore()
  const { isBotUser, isBlockedUser } = useUserFilterStore()
  const managerRef = useRef<WebSocketManager | null>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  const handleMessage = useCallback((message: ChatDataItem) => {
    // Filter out blocked users
    if (isBlockedUser(message.nickname)) {
      return
    }
    
    // Convert bot messages to notifications
    if (message.type === 'message' && isBotUser(message.nickname)) {
      const notification: ChatDataItem = {
        ...message,
        type: 'notification',
        notificationType: 'alert'
      }
      addMessage(notification)
    } else {
      addMessage(message)
    }
  }, [addMessage, isBotUser, isBlockedUser])

  const handleStatusChange = useCallback((status: string) => {
    setConnectionStatus(status)
  }, [setConnectionStatus])

  useEffect(() => {
    if (!autoConnect) return

    managerRef.current = WebSocketManager.getInstance()
    
    // Subscribe to messages and status changes
    unsubscribeRef.current = managerRef.current.subscribe(handleMessage, handleStatusChange)
    
    // Connect to the channel
    managerRef.current.connect(channel)

    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
    }
  }, [channel, autoConnect, handleMessage, handleStatusChange])

  const connect = () => {
    if (managerRef.current) {
      managerRef.current.connect(channel)
    }
  }

  const disconnect = () => {
    if (managerRef.current) {
      managerRef.current.disconnect()
    }
  }

  const changeChannel = (newChannel: string) => {
    clearMessages()
    if (managerRef.current) {
      managerRef.current.changeChannel(newChannel)
    }
  }

  return {
    connect,
    disconnect,
    changeChannel
  }
}