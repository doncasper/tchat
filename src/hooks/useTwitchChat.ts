import { useEffect, useRef } from 'react'
import { TwitchWebSocket } from '../services/twitchWebSocket'
import { useChatStore } from '../store/chatStore'

interface UseTwitchChatOptions {
  channel?: string
  autoConnect?: boolean
}

// Global reference to prevent multiple instances
let globalWebSocket: TwitchWebSocket | null = null
let connectionCount = 0

export const useTwitchChat = (options: UseTwitchChatOptions = {}) => {
  const { 
    channel = 'takotoken', 
    autoConnect = true 
  } = options

  const wsRef = useRef<TwitchWebSocket | null>(null)
  const { addMessage, setConnectionStatus, clearMessages } = useChatStore()
  const isInitialized = useRef(false)

  useEffect(() => {
    if (!autoConnect || isInitialized.current) return

    connectionCount++
    console.log(`Connection attempt ${connectionCount}`)

    // Reuse existing global connection or create new one
    if (!globalWebSocket) {
      globalWebSocket = new TwitchWebSocket({
        channel,
        onMessage: (message) => {
          addMessage(message)
        },
        onStatusChange: (status) => {
          setConnectionStatus(status)
        },
        onConnect: () => {
          console.log('WebSocket connected')
        },
        onDisconnect: () => {
          console.log('WebSocket disconnected')
        }
      })
      globalWebSocket.connect()
    } else if (globalWebSocket) {
      // Change channel if different
      globalWebSocket.changeChannel(channel)
    }

    wsRef.current = globalWebSocket
    isInitialized.current = true

    // Cleanup on unmount
    return () => {
      connectionCount--
      console.log(`Connection cleanup, remaining: ${connectionCount}`)
      
      // Only disconnect when no more components are using it
      if (connectionCount <= 0 && globalWebSocket) {
        globalWebSocket.disconnect()
        globalWebSocket = null
        wsRef.current = null
        isInitialized.current = false
      }
    }
  }, [channel, autoConnect, addMessage, setConnectionStatus])

  const connect = () => {
    wsRef.current?.connect()
  }

  const disconnect = () => {
    wsRef.current?.disconnect()
  }

  const changeChannel = (newChannel: string) => {
    clearMessages()
    wsRef.current?.changeChannel(newChannel)
  }

  return {
    connect,
    disconnect,
    changeChannel
  }
}