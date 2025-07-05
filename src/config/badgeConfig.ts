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
    imageId: '5527c58c-fb7d-422d-b71b-f309dcb85cc1/3'
  },
  moderator: {
    id: 'moderator',
    displayName: 'MOD',
    color: '#00ad03',
    imageId: '3267646d-33f0-4b17-b3df-f923a41db1d0/3'
  },
  vip: {
    id: 'vip',
    displayName: 'VIP',
    color: '#e005b9',
    imageId: 'b817aba4-fad8-49e2-b88a-7cc744dfa6ec/3'
  },
  subscriber: {
    id: 'subscriber',
    displayName: 'SUB',
    color: '#8205b4',
    imageId: '5d9f2208-5dd8-11e7-8513-2ff4adfae661/3'
  },
  founder: {
    id: 'founder',
    displayName: 'FOUNDER',
    color: '#00d7ff',
    imageId: '511b78a9-ab37-472f-9569-457753bbe7d3/3'
  },
  staff: {
    id: 'staff',
    displayName: 'STAFF',
    color: '#200f33',
    imageId: 'd97c37bd-a6f5-4c38-8f57-4e4bef88af34/3'
  },
  admin: {
    id: 'admin',
    displayName: 'ADMIN',
    color: '#faaf19',
    imageId: '9ef7e029-4cdf-4d4d-a0d5-e2b3fb2583fe/3'
  },
  global_mod: {
    id: 'global_mod',
    displayName: 'GLOBAL MOD',
    color: '#00ad03',
    imageId: '9384c43e-4ce7-4e94-b2a1-b93656896eba/3'
  },
  partner: {
    id: 'partner',
    displayName: 'PARTNER',
    color: '#9146ff',
    imageId: 'd12a2e27-16f6-41d0-ab77-b780518f00a3/3'
  },
  artist: {
    id: 'artist',
    displayName: 'ARTIST',
    color: '#ff7100',
    imageId: 'c7b12e75-c1eb-48c5-a3d0-f0b0b1b4b1d4/3'
  },
  turbo: {
    id: 'turbo',
    displayName: 'TURBO',
    color: '#6441a5',
    imageId: 'bd444ec6-8f34-4bf9-91f4-af1e3428d80f/3'
  },
  premium: {
    id: 'premium',
    displayName: 'PREMIUM',
    color: '#009cde',
    imageId: 'bbbe0db0-a598-423e-86d0-f9fb98ca1933/3'
  },
  verified: {
    id: 'verified',
    displayName: 'VERIFIED',
    color: '#01aaff',
    imageId: 'd12a2e27-16f6-41d0-ab77-b780518f00a3/3'
  }
}

export const getBadgeImageUrl = (badgeId: string): string => {
  const badge = BADGE_CONFIG[badgeId]
  const imageId = badge?.imageId || `${badgeId}/1`
  return `https://static-cdn.jtvnw.net/badges/v1/${imageId}`
}