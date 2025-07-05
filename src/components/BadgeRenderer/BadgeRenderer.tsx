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
            <span
              key={badge}
              className={className}
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                backgroundColor: 'transparent'
              }}
            >
              <img
                src={getBadgeImageUrl(badge)}
                alt={badgeInfo.displayName}
                style={{ 
                  height: '18px', 
                  width: '18px',
                  display: 'block'
                }}
                onError={(e) => {
                  // Fallback to text if image fails to load
                  const target = e.target as HTMLImageElement
                  const parent = target.parentElement
                  if (parent) {
                    parent.style.backgroundColor = badgeInfo.color
                    parent.style.padding = '0 4px'
                    parent.innerHTML = badgeInfo.displayName
                  }
                }}
              />
            </span>
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