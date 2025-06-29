import React, { useMemo } from 'react'
import type { TwitchEmote } from '../../types/ChatTypes'
import styles from './EmoteRenderer.module.css'

interface EmoteRendererProps {
  text: string
  emotes?: TwitchEmote[]
}

export const EmoteRenderer: React.FC<EmoteRendererProps> = ({ 
  text, 
  emotes = []
}) => {
  const segments = useMemo(() => {
    if (!emotes || emotes.length === 0) {
      return [{ type: 'text' as const, content: text }]
    }

    const result: Array<{ type: 'text' | 'emote'; content: string; emote?: TwitchEmote }> = []
    let lastIndex = 0

    // Sort emotes by start position to ensure proper rendering
    const sortedEmotes = [...emotes].sort((a, b) => a.start - b.start)

    for (const emote of sortedEmotes) {
      // Add text before emote (preserve spaces but avoid empty content)
      if (emote.start > lastIndex) {
        const textContent = text.substring(lastIndex, emote.start)
        if (textContent) {
          result.push({ type: 'text', content: textContent })
        }
      }

      // Add emote
      result.push({ 
        type: 'emote', 
        content: emote.name,
        emote 
      })

      lastIndex = emote.end + 1
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex)
      if (remainingText) {
        result.push({ type: 'text', content: remainingText })
      }
    }

    return result
  }, [text, emotes])

  return (
    <span className={styles.messageText}>
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          return segment.content
        }

        if (segment.type === 'emote' && segment.emote) {
          const emoteUrl = `https://static-cdn.jtvnw.net/emoticons/v2/${segment.emote.id}/default/dark/3.0`
          
          return (
            <img
              key={index}
              src={emoteUrl}
              alt={segment.content}
              title={segment.content}
              className={styles.emote}
              loading="lazy"
              onError={(e) => {
                // Fallback to text if emote fails to load
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const textSpan = document.createElement('span')
                textSpan.textContent = segment.content
                target.parentNode?.insertBefore(textSpan, target)
              }}
            />
          )
        }

        return null
      })}
    </span>
  )
}