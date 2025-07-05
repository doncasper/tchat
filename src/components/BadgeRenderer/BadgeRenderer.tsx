import React from 'react'
import { useUIStore } from '../../store/uiStore'
import { BADGE_CONFIG, getBadgeImageUrl } from '../../config/badgeConfig'

interface BadgeRendererProps {
  badges: string[]
  badgeInfo?: Array<{ type: string; version: string }>
  className?: string
}

export const BadgeRenderer: React.FC<BadgeRendererProps> = ({ badges, badgeInfo, className = 'badge' }) => {
  const { showBadges, badgeDisplayMode } = useUIStore()

  if (!showBadges || (!badges || badges.length === 0) && (!badgeInfo || badgeInfo.length === 0)) {
    return null
  }

  // Helper function to get badge URL from Twitch CDN
  const getTwitchBadgeUrl = (type: string, version: string) => {
    return `https://static-cdn.jtvnw.net/badges/v1/${type}/${version}/3`
  }

  if (badgeDisplayMode === 'image' && badgeInfo && badgeInfo.length > 0) {
    // Use badgeInfo for images when available
    return (
      <>
        {badgeInfo.map((badge, index) => {
          const knownBadge = BADGE_CONFIG[badge.type]
          
          return (
            <span
              key={`${badge.type}-${badge.version}-${index}`}
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
                src={knownBadge?.imageId ? getBadgeImageUrl(badge.type) : getTwitchBadgeUrl(badge.type, badge.version)}
                alt={knownBadge?.displayName || badge.type}
                style={{ 
                  height: '18px', 
                  width: '18px',
                  display: 'block'
                }}
                onError={(e) => {
                  // Fallback to text if image fails to load
                  const target = e.target as HTMLImageElement
                  const parent = target.parentElement
                  if (parent && knownBadge) {
                    parent.style.backgroundColor = knownBadge.color
                    parent.style.padding = '0 4px'
                    parent.innerHTML = knownBadge.displayName
                  } else if (parent) {
                    parent.style.backgroundColor = '#6441a5'
                    parent.style.padding = '0 4px'
                    parent.innerHTML = badge.type.toUpperCase()
                  }
                }}
              />
            </span>
          )
        })}
      </>
    )
  }

  // Text mode - use badges array
  return (
    <>
      {badges.map((badge) => {
        const badgeConfig = BADGE_CONFIG[badge]
        if (!badgeConfig) {
          // Unknown badge - display with default styling
          return (
            <span
              key={badge}
              className={className}
              style={{ backgroundColor: '#6441a5' }}
            >
              {badge.toUpperCase()}
            </span>
          )
        }

        return (
          <span
            key={badge}
            className={className}
            style={{ backgroundColor: badgeConfig.color }}
          >
            {badgeConfig.displayName}
          </span>
        )
      })}
    </>
  )
}