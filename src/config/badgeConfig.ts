// Twitch badge CDN configuration
// Badge images: https://static-cdn.jtvnw.net/badges/v1/{badge_id}/1.png

export interface BadgeInfo {
  id: string
  displayName: string
  color: string
  // Image ID for CDN (some badges have different IDs on CDN)
  imageId?: string
}

export const BADGE_CONFIG: Record<string, BadgeInfo> = {
  broadcaster: {
    id: 'broadcaster',
    displayName: 'STREAMER',
    color: '#e91916',
    imageId: 'broadcaster/1'
  },
  moderator: {
    id: 'moderator',
    displayName: 'MOD',
    color: '#00ad03',
    imageId: 'moderator/1'
  },
  vip: {
    id: 'vip',
    displayName: 'VIP',
    color: '#e005b9',
    imageId: 'vip/1'
  },
  subscriber: {
    id: 'subscriber',
    displayName: 'SUB',
    color: '#8205b4',
    imageId: 'subscriber/1'
  },
  founder: {
    id: 'founder',
    displayName: 'FOUNDER',
    color: '#00d7ff',
    imageId: 'founder/1'
  },
  staff: {
    id: 'staff',
    displayName: 'STAFF',
    color: '#200f33',
    imageId: 'staff/1'
  },
  admin: {
    id: 'admin',
    displayName: 'ADMIN',
    color: '#faaf19',
    imageId: 'admin/1'
  },
  global_mod: {
    id: 'global_mod',
    displayName: 'GLOBAL MOD',
    color: '#00ad03',
    imageId: 'globalmod/1'
  },
  partner: {
    id: 'partner',
    displayName: 'PARTNER',
    color: '#9146ff',
    imageId: 'partner/1'
  },
  artist: {
    id: 'artist',
    displayName: 'ARTIST',
    color: '#ff7100',
    imageId: 'artist/1'
  },
  turbo: {
    id: 'turbo',
    displayName: 'TURBO',
    color: '#6441a5',
    imageId: 'turbo/1'
  },
  premium: {
    id: 'premium',
    displayName: 'PREMIUM',
    color: '#009cde',
    imageId: 'premium/1'
  },
  verified: {
    id: 'verified',
    displayName: 'VERIFIED',
    color: '#01aaff',
    imageId: 'verified/1'
  }
}

export const getBadgeImageUrl = (badgeId: string): string => {
  const badge = BADGE_CONFIG[badgeId]
  const imageId = badge?.imageId || `${badgeId}/1`
  return `https://static-cdn.jtvnw.net/badges/v1/${imageId}.png`
}