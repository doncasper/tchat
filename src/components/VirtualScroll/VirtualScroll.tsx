import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import type { ChatDataItem } from '../../types/ChatTypes'
import styles from './VirtualScroll.module.css'

interface VirtualScrollProps {
  messages: ChatDataItem[]
  itemHeight: number // Estimated height for each item
  bufferSize?: number // Number of items to render outside viewport
  overscan?: number // Additional items to render for smoother scrolling
  renderMessage: (message: ChatDataItem, index: number) => React.ReactNode
  onScroll?: (isAtBottom: boolean) => void
  scrollToBottomRef?: React.RefObject<() => void>
  className?: string
  onlyFullyVisible?: boolean // Only render fully visible messages
}

export const VirtualScroll: React.FC<VirtualScrollProps> = ({
  messages,
  itemHeight,
  bufferSize = 5,
  overscan = 3,
  renderMessage,
  onScroll,
  scrollToBottomRef,
  className,
  onlyFullyVisible = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const itemHeights = useRef<Map<string, number>>(new Map())
  const [averageItemHeight, setAverageItemHeight] = useState(itemHeight)

  // Calculate total height based on actual measured heights
  const totalHeight = useMemo(() => {
    if (onlyFullyVisible) {
      // When showing only fully visible messages, use container height to prevent gaps
      return Math.max(containerHeight, 1)
    }
    
    let height = 0
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i]
      if (message) {
        const measuredHeight = itemHeights.current.get(message.id)
        height += measuredHeight || averageItemHeight
      }
    }
    return height
  }, [messages, averageItemHeight, onlyFullyVisible, containerHeight])

  // Calculate which items are visible
  const visibleRange = useMemo(() => {
    // If no height yet, show first few items to bootstrap
    if (!containerHeight) {
      return { start: 0, end: Math.min(10, messages.length) }
    }

    let accumulatedHeight = 0
    let start = 0
    let end = messages.length

    if (onlyFullyVisible) {
      // For "only fully visible", we need to ensure messages stick to bottom
      // and don't create gaps. Start from the end and work backwards.
      
      // First, find how many messages can fit fully in the viewport
      const visibleMessagesFromBottom = []
      let totalHeightFromBottom = 0
      
      // Work backwards from the newest messages
      for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i]
        if (message) {
          const height = itemHeights.current.get(message.id) || averageItemHeight
          
          // If adding this message would exceed viewport height, stop
          if (totalHeightFromBottom + height > containerHeight) {
            break
          }
          
          totalHeightFromBottom += height
          visibleMessagesFromBottom.unshift(i) // Add to beginning
        }
      }
      
      // Set the range to show only these fully visible messages
      if (visibleMessagesFromBottom.length > 0) {
        start = visibleMessagesFromBottom[0]
        end = visibleMessagesFromBottom[visibleMessagesFromBottom.length - 1] + 1
      } else {
        // If no messages fit, show the last message (partially)
        start = Math.max(0, messages.length - 1)
        end = messages.length
      }
    } else {
      // Original logic with partial visibility
      // Find start index
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i]
        if (message) {
          const height = itemHeights.current.get(message.id) || averageItemHeight
          
          if (accumulatedHeight + height > scrollTop) {
            start = Math.max(0, i - bufferSize - overscan)
            break
          }
          accumulatedHeight += height
        }
      }

      // Find end index
      accumulatedHeight = 0
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i]
        if (message) {
          const height = itemHeights.current.get(message.id) || averageItemHeight
          accumulatedHeight += height
          
          if (accumulatedHeight > scrollTop + containerHeight) {
            end = Math.min(messages.length, i + bufferSize + overscan)
            break
          }
        }
      }
    }

    return { start, end }
  }, [messages, scrollTop, containerHeight, bufferSize, overscan, averageItemHeight, onlyFullyVisible])

  // Items to render (normal order for bottom display)
  const visibleItems = useMemo(() => {
    return messages.slice(visibleRange.start, visibleRange.end)
  }, [messages, visibleRange])

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const newScrollTop = target.scrollTop
    setScrollTop(newScrollTop)

    // For flex-column-reverse, "bottom" is when scrollTop is near 0
    const isAtBottom = newScrollTop < 10
    
    // Update auto-scroll flag based on user's scroll position
    shouldAutoScroll.current = isAtBottom
    
    onScroll?.(isAtBottom)
  }, [onScroll])

  // Scroll to bottom function (for flex-column-reverse, bottom is scrollTop = 0)
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0
    }
  }, [])

  // Expose scroll to bottom function
  useEffect(() => {
    if (scrollToBottomRef && 'current' in scrollToBottomRef) {
      scrollToBottomRef.current = scrollToBottom
    }
  }, [scrollToBottom, scrollToBottomRef])

  // Update container height on resize
  useEffect(() => {
    const updateHeight = () => {
      if (scrollAreaRef.current) {
        const height = scrollAreaRef.current.clientHeight
        setContainerHeight(height)
      }
    }

    // Use a small delay to ensure DOM is ready
    setTimeout(updateHeight, 0)
    window.addEventListener('resize', updateHeight)
    
    // Also update on messages change in case container size changes
    updateHeight()
    
    return () => window.removeEventListener('resize', updateHeight)
  }, [messages.length])

  // Track if we should auto-scroll to bottom
  const shouldAutoScroll = useRef(true)
  const previousScrollHeight = useRef(0)

  // Check if user is at bottom before height changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const isAtBottom = scrollAreaRef.current.scrollTop < 10
      shouldAutoScroll.current = isAtBottom
      previousScrollHeight.current = scrollAreaRef.current.scrollHeight
    }
  }, [messages.length])

  // Observer to measure item heights
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      let measuredCount = 0
      let heightChanged = false

      for (const entry of entries) {
        const element = entry.target as HTMLElement
        const messageId = element.getAttribute('data-message-id')
        if (messageId) {
          const newHeight = entry.contentRect.height
          const oldHeight = itemHeights.current.get(messageId)
          
          if (oldHeight !== newHeight) {
            heightChanged = true
          }
          
          itemHeights.current.set(messageId, newHeight)
          measuredCount++
        }
      }

      // Update average height based on measurements
      if (measuredCount > 0) {
        const allHeights = Array.from(itemHeights.current.values())
        const newAverage = allHeights.reduce((a, b) => a + b, 0) / allHeights.length
        setAverageItemHeight(newAverage)
      }

      // If heights changed and we should auto-scroll, maintain bottom position
      if (heightChanged && shouldAutoScroll.current && scrollAreaRef.current) {
        // Small delay to ensure DOM is updated
        setTimeout(() => {
          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = 0 // For column-reverse, 0 is bottom
          }
        }, 0)
      }
    })

    // Observe all message elements
    const messageElements = containerRef.current?.querySelectorAll('[data-message-id]')
    messageElements?.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [visibleItems])

  // Auto-scroll to bottom when new messages arrive or when onlyFullyVisible changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const currentScrollHeight = scrollAreaRef.current.scrollHeight
      
      // Always scroll to bottom when onlyFullyVisible is enabled or when new messages arrive
      if (onlyFullyVisible || (shouldAutoScroll.current && currentScrollHeight > previousScrollHeight.current)) {
        setTimeout(() => {
          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = 0
            shouldAutoScroll.current = true // Ensure we're tracking as at bottom
          }
        }, 0)
      }
      
      previousScrollHeight.current = currentScrollHeight
    }
  }, [messages, onlyFullyVisible])

  // Force scroll to bottom when switching to onlyFullyVisible mode
  useEffect(() => {
    if (onlyFullyVisible && scrollAreaRef.current) {
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = 0
          shouldAutoScroll.current = true
        }
      }, 0)
    }
  }, [onlyFullyVisible])

  return (
    <div 
      ref={scrollAreaRef}
      className={`${styles.scrollArea} ${className || ''}`}
      onScroll={handleScroll}
    >
      <div 
        className={styles.scrollContainer}
        style={{ height: Math.max(totalHeight, 1) }}
      >
        <div 
          ref={containerRef}
          className={styles.visibleArea}
          style={{ 
            justifyContent: onlyFullyVisible ? 'flex-end' : 'flex-start',
            minHeight: onlyFullyVisible ? '100%' : 'auto'
          }}
        >
          {visibleItems.map((message, index) => (
            <div 
              key={message.id} 
              data-message-id={message.id}
              className={styles.messageWrapper}
            >
              {renderMessage(message, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}