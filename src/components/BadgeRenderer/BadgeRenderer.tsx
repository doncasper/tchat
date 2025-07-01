import React from 'react'
import { useUIStore } from '../../store/uiStore'
import { BADGE_CONFIG, getBadgeImageUrl } from '../../config/badgeConfig'

interface BadgeRendererProps {
  badges: string[]
  className?: string
}

export const BadgeRenderer: React.FC<BadgeRendererProps> = ({ badges, className = 'badge' }) => {
  const { showBadges, badgeDisplayMode } = useUIStore()

  if (!showBadges || !badges || badges.length === 0) {
    return null
  }

  return (
    <>
      {badges.map((badge) => {
        const badgeInfo = BADGE_CONFIG[badge]
        if (!badgeInfo) return null

        if (badgeDisplayMode === 'image') {
          return (
            <img
              key={badge}
              src={getBadgeImageUrl(badge)}
              alt={badgeInfo.displayName}
              className={className}
              onError={(e) => {
                // Fallback to text if image fails to load
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const textSpan = document.createElement('span')
                textSpan.className = className
                textSpan.style.backgroundColor = badgeInfo.color
                textSpan.textContent = badgeInfo.displayName
                const parentNode = target.parentNode
                if (parentNode) {
                  parentNode.replaceChild(textSpan, target)
                }
              }}
            />
          )
        }

        return (
          <span
            key={badge}
            className={className}
            style={{ backgroundColor: badgeInfo.color }}
          >
            {badgeInfo.displayName}
          </span>
        )
      })}
    </>
  )
}