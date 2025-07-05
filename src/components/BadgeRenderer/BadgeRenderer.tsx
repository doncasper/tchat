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


  if (badgeDisplayMode === 'image') {
    // Image mode - render badges as images
    return (
      <>
        {badges.map((badge, index) => {
          let badgeConfig = BADGE_CONFIG[badge]
          
          // Special handling for subscriber badges with versions > 6
          if (!badgeConfig && badge.startsWith('subscriber/')) {
            const parts = badge.split('/')
            if (parts.length > 1 && parts[1]) {
              const version = parseInt(parts[1])
              if (!isNaN(version) && version > 6) {
                // Use subscriber/6 for all subscriber badges with version > 6
                badgeConfig = BADGE_CONFIG['subscriber/6']
              }
            }
          }
          
          // Extract type from badge ID
          const type = badge.includes('/') ? badge.split('/')[0] : badge
          
          return (
            <span
              key={`${badge}-${index}`}
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
                alt={badgeConfig?.displayName || type}
                title={badgeConfig?.displayName || type}
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
                  if (parent && badgeConfig) {
                    parent.style.backgroundColor = badgeConfig.color
                    parent.style.padding = '0 4px'
                    parent.innerHTML = badgeConfig.displayName
                  } else if (parent) {
                    parent.style.backgroundColor = '#6441a5'
                    parent.style.padding = '0 4px'
                    parent.innerHTML = type?.toUpperCase() || 'BADGE'
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
        let badgeConfig = BADGE_CONFIG[badge]
        
        // Special handling for subscriber badges with versions > 6
        if (!badgeConfig && badge.startsWith('subscriber/')) {
          const parts = badge.split('/')
          if (parts.length > 1 && parts[1]) {
            const version = parseInt(parts[1])
            if (!isNaN(version) && version > 6) {
              // Use subscriber/6 display name for all subscriber badges with version > 6
              badgeConfig = BADGE_CONFIG['subscriber/6']
            }
          }
        }
        
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