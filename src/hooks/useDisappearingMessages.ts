import { useEffect, useRef } from 'react'
import { useChatStore } from '../store/chatStore'

export const useDisappearingMessages = () => {
  const { messages, disappearingDelay, removeMessage } = useChatStore()
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    // Clear all existing timers
    const currentTimers = timersRef.current
    currentTimers.forEach(timer => clearTimeout(timer))
    currentTimers.clear()

    // If disappearing is disabled, don't set any timers
    if (disappearingDelay <= 0) {
      return
    }

    // Set timer for each message
    messages.forEach(message => {
      if (!currentTimers.has(message.id)) {
        const timer = setTimeout(() => {
          removeMessage(message.id)
          currentTimers.delete(message.id)
        }, disappearingDelay)
        
        currentTimers.set(message.id, timer)
      }
    })

    // Cleanup function
    return () => {
      currentTimers.forEach(timer => clearTimeout(timer))
      currentTimers.clear()
    }
  }, [messages, disappearingDelay, removeMessage])
}