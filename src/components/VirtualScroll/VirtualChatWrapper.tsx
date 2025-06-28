import React, { useCallback, useRef, useEffect } from 'react'
import type { ChatDataItem } from '../../types/ChatTypes'
import { VirtualScroll } from './VirtualScroll'
import { useChatStore } from '../../store/chatStore'
import { useUIStore } from '../../store/uiStore'

interface VirtualChatWrapperProps {
  messages: ChatDataItem[]
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  renderMessage: (message: ChatDataItem) => React.ReactNode
  renderNotification: (notification: ChatDataItem) => React.ReactNode
}

export const VirtualChatWrapper: React.FC<VirtualChatWrapperProps> = ({
  messages,
  messagesEndRef,
  renderMessage,
  renderNotification
}) => {
  const { autoScroll } = useChatStore()
  const { fontSizeMultiplier } = useUIStore()
  const scrollToBottomRef = useRef<() => void>(() => {})
  const isUserScrolling = useRef(false)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Render function for virtual scroll
  const renderItem = useCallback((item: ChatDataItem) => {
    switch (item.type) {
      case 'notification':
        return renderNotification(item)
      case 'message':
        return renderMessage(item)
      default:
        console.log('Unknown message type:', item.type)
        return null
    }
  }, [renderMessage, renderNotification])

  // Handle scroll events
  const handleScroll = useCallback((isAtBottom: boolean) => {
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // User is actively scrolling
    if (!isAtBottom) {
      isUserScrolling.current = true
    }

    // If at bottom, reset user scrolling flag after a delay
    if (isAtBottom) {
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrolling.current = false
      }, 100)
    }
  }, [])

  // Auto-scroll effect
  useEffect(() => {
    if (autoScroll && !isUserScrolling.current && messages.length > 0) {
      // Small delay to ensure DOM is updated
      const timeoutId = setTimeout(() => {
        scrollToBottomRef.current?.()
        
        // Trigger the ref callback if provided
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 50)

      return () => clearTimeout(timeoutId)
    }
  }, [messages, autoScroll, messagesEndRef])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <VirtualScroll
        key={fontSizeMultiplier}
        messages={messages}
        itemHeight={60} // Estimated height, will be auto-adjusted
        bufferSize={10}
        overscan={5}
        renderMessage={renderItem}
        onScroll={handleScroll}
        scrollToBottomRef={scrollToBottomRef}
        className=""
      />
      {/* Hidden ref for compatibility */}
      <div ref={messagesEndRef} style={{ height: 0, overflow: 'hidden', position: 'absolute' }} />
    </>
  )
}