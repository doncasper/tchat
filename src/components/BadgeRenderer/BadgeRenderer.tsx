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
    // Handle special cases where badge type needs mapping
    const mappedType = type.replace('_', '-') // Convert underscore to dash
    return `https://static-cdn.jtvnw.net/badges/v1/${mappedType}/${version}/3`
  }

  if (badgeDisplayMode === 'image' && badgeInfo && badgeInfo.length > 0) {
    // Use badgeInfo for images when available
    return (
      <>
        {badgeInfo.map((badge, index) => {
          // Look up the badge using the full ID (type/version)
          const fullBadgeId = `${badge.type}/${badge.version}`
          const knownBadge = BADGE_CONFIG[fullBadgeId]
          
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
                src={knownBadge?.imageId ? getBadgeImageUrl(fullBadgeId) : getTwitchBadgeUrl(badge.type, badge.version)}
                alt={knownBadge?.displayName || badge.type}
                title={knownBadge?.displayName || badge.type}
                style={{ 
                  height: '1.2em', 
                  width: '1.2em',
                  display: 'block',
                  verticalAlign: 'middle'
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
      {badges.map((badge, index) => {
        const badgeConfig = BADGE_CONFIG[badge]
        if (!badgeConfig) {
          // Unknown badge - display with default styling
          // Extract the badge type from versioned badges (e.g., "subscriber/0" -> "subscriber")
          const badgeType = badge.includes('/') ? badge.split('/')[0] : badge
          return (
            <span
              key={`${badge}-${index}`}
              className={className}
              style={{ backgroundColor: '#6441a5' }}
            >
              {badgeType?.toUpperCase() || 'BADGE'}
            </span>
          )
        }

        return (
          <span
            key={`${badge}-${index}`}
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