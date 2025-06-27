import type { ChatDataItem } from '../types/ChatTypes'


interface TwitchTags {
  'display-name'?: string
  'user-id'?: string
  'room-id'?: string
  'msg-id'?: string
  'msg-param-displayName'?: string
  'msg-param-viewerCount'?: string
  'msg-param-mass-gift-count'?: string
  'msg-param-gift-count'?: string
  color?: string
  badges?: string
  'badge-info'?: string
  emotes?: string
  mod?: string
  subscriber?: string
  bits?: string
  [key: string]: string | undefined
}

export interface TwitchWebSocketConfig {
  channel: string
  onMessage: (message: ChatDataItem) => void
  onStatusChange: (status: string) => void
  onConnect?: () => void
  onDisconnect?: () => void
}

export class TwitchWebSocket {
  private ws: WebSocket | null = null
  private config: TwitchWebSocketConfig
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private pingInterval: number | null = null
  private isConnected = false

  private readonly TWITCH_IRC_URL = 'wss://irc-ws.chat.twitch.tv:443'
  
  // Twitch color palette for users without colors
  private readonly TWITCH_COLORS = [
    '#FF0000', '#0000FF', '#00FF00', '#B22222', '#FF7F50',
    '#9ACD32', '#FF4500', '#2E8B57', '#DAA520', '#D2691E',
    '#5F9EA0', '#1E90FF', '#FF69B4', '#8A2BE2', '#00FF7F'
  ]

  private colorCache = new Map<string, string>()

  constructor(config: TwitchWebSocketConfig) {
    this.config = config
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected')
      return
    }

    try {
      this.config.onStatusChange('Connecting...')
      this.ws = new WebSocket(this.TWITCH_IRC_URL)

      this.ws.onopen = () => {
        console.log('Connected to Twitch IRC')
        this.isConnected = true
        this.reconnectAttempts = 0
        this.authenticate()
        this.startPingInterval()
        this.config.onConnect?.()
      }

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data)
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.config.onStatusChange('Connection error')
      }

      this.ws.onclose = () => {
        console.log('Disconnected from Twitch IRC')
        this.isConnected = false
        this.stopPingInterval()
        this.config.onStatusChange('Disconnected')
        this.config.onDisconnect?.()
        this.attemptReconnect()
      }
    } catch (error) {
      console.error('Failed to connect:', error)
      this.config.onStatusChange('Connection failed')
    }
  }

  disconnect() {
    this.isConnected = false
    this.stopPingInterval()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  private authenticate() {
    if (!this.ws) return
    
    // Use anonymous connection (justinfan + random numbers)
    const username = `justinfan${Math.floor(Math.random() * 80000 + 1000)}`
    
    this.ws.send('CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands')
    this.ws.send(`NICK ${username}`)
    this.ws.send(`JOIN #${this.config.channel}`)
    this.config.onStatusChange(`Connected to ${this.config.channel}`)
  }

  private handleMessage(data: string) {
    const lines = data.split('\r\n')
    lines.forEach(line => {
      if (!line) return

      if (line.startsWith('PING')) {
        this.ws?.send('PONG :tmi.twitch.tv')
        return
      }

      if (line.includes('PRIVMSG')) {
        this.parseChatMessage(line)
      } else if (line.includes('USERNOTICE')) {
        this.parseUserNotice(line)
      }
    })
  }

  private parseChatMessage(line: string) {
    const match = line.match(/@(.+?) PRIVMSG #\w+ :(.+)/)
    if (!match) return

    const tags = this.parseTags(line)
    const username = tags['display-name'] || match[1]?.split('!')[0] || 'Unknown'
    const message = match[2]
    const badges = this.parseBadges(tags.badges)
    const userType = this.getUserType(tags, badges)

    // Handle bits (cheering)
    if (tags.bits) {
      const bitMessage: ChatDataItem = {
        id: `${Date.now()}-${Math.random()}`,
        type: 'notification',
        notificationType: 'bits',
        text: `${username} cheered ${tags.bits} bits!`,
        nickname: username || 'Unknown',
        time: new Date(),
        count: parseInt(tags.bits)
      }
      this.config.onMessage(bitMessage)
    }

    // Regular message
    const chatMessage: ChatDataItem = {
      id: `${Date.now()}-${Math.random()}`,
      type: 'message',
      text: message || '',
      nickname: username || 'Unknown',
      userType,
      time: new Date(),
      badges,
      // Note: Emote rendering would be handled by the UI component
    }

    this.config.onMessage(chatMessage)
  }

  private parseUserNotice(line: string) {
    const tags = this.parseTags(line)
    const msgId = tags['msg-id']
    let notification: ChatDataItem | null = null

    switch (msgId) {
      case 'sub':
      case 'resub':
        notification = {
          id: `${Date.now()}-${Math.random()}`,
          type: 'notification',
          notificationType: 'sub',
          text: `${tags['display-name'] || tags['login'] || 'Someone'} just subscribed!`,
          nickname: tags['display-name'] || tags['login'] || 'Someone',
          time: new Date()
        }
        break

      case 'subgift':
      case 'anonsubgift':
        notification = {
          id: `${Date.now()}-${Math.random()}`,
          type: 'notification',
          notificationType: 'sub_gift',
          text: `${tags['display-name'] || 'An anonymous user'} gifted a sub!`,
          nickname: tags['display-name'] || 'Anonymous',
          time: new Date()
        }
        break

      case 'raid':
        notification = {
          id: `${Date.now()}-${Math.random()}`,
          type: 'notification',
          notificationType: 'raid',
          text: `${tags['msg-param-displayName'] || 'Someone'} is raiding with ${tags['msg-param-viewerCount'] || '?'} viewers!`,
          nickname: tags['msg-param-displayName'] || 'Someone',
          time: new Date(),
          count: parseInt(tags['msg-param-viewerCount'] || '0')
        }
        break

      case 'submysterygift':
        const count = tags['msg-param-mass-gift-count'] || tags['msg-param-gift-count'] || '?'
        notification = {
          id: `${Date.now()}-${Math.random()}`,
          type: 'notification',
          notificationType: 'sub_gift',
          text: `${tags['display-name'] || 'Someone'} is gifting ${count} subs!`,
          nickname: tags['display-name'] || 'Someone',
          time: new Date(),
          count: parseInt(count)
        }
        break
    }

    if (notification) {
      this.config.onMessage(notification)
    }
  }

  private parseTags(line: string): TwitchTags {
    const tagsMatch = line.match(/@(.+?) /)
    if (!tagsMatch) return {}

    const tagsString = tagsMatch[1]
    if (!tagsString) return {}
    
    const tags: TwitchTags = {}

    tagsString.split(';').forEach(tag => {
      const [key, value] = tag.split('=')
      if (key) {
        tags[key] = value
      }
    })

    return tags
  }

  private parseBadges(badgesString?: string): string[] {
    if (!badgesString) return []

    const badges: string[] = []
    const badgeList = badgesString.split(',')

    badgeList.forEach(badge => {
      const [type] = badge.split('/')
      if (type) {
        badges.push(type)
      }
    })

    return badges
  }

  private getUserType(tags: TwitchTags, badges: string[]): ChatDataItem['userType'] {
    if (badges.includes('broadcaster')) return 'broadcaster'
    if (badges.includes('moderator') || tags.mod === '1') return 'moderator'
    if (badges.includes('vip')) return 'vip'
    if (badges.includes('subscriber') || tags.subscriber === '1') return 'subscriber'
    if (badges.includes('staff')) return 'staff'
    if (badges.includes('partner')) return 'partner'
    if (badges.includes('founder')) return 'founder'
    if (badges.includes('artist')) return 'artist'
    if (badges.includes('turbo')) return 'turbo'
    return undefined
  }

  private parseColor(colorTag?: string, username?: string): string {
    if (!colorTag || colorTag === '') {
      return this.generateTwitchColor(username)
    }

    let color = colorTag
    if (!color.startsWith('#')) {
      // RGB format (r,g,b)
      const rgb = color.split(',').map(c => parseInt(c.trim()))
      color = this.rgbToHex(rgb[0], rgb[1], rgb[2])
    }

    if (username) {
      this.colorCache.set(username, color)
    }
    return color
  }

  private generateTwitchColor(username?: string): string {
    if (!username) return '#FFFFFF'
    
    if (this.colorCache.has(username)) {
      return this.colorCache.get(username)!
    }

    const name = username.toLowerCase()
    let hash = 0

    for (let i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i)
      hash = hash & hash // Convert to 32-bit integer
    }

    const colorIndex = Math.abs(hash) % this.TWITCH_COLORS.length
    const color = this.TWITCH_COLORS[colorIndex]

    if (color) {
      this.colorCache.set(username, color)
      return color
    }
    
    return '#FFFFFF'
  }

  private rgbToHex(r?: number, g?: number, b?: number): string {
    const red = Math.max(0, Math.min(255, Math.round(r || 0)))
    const green = Math.max(0, Math.min(255, Math.round(g || 0)))
    const blue = Math.max(0, Math.min(255, Math.round(b || 0)))

    const toHex = (n: number) => {
      const hex = n.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }

    return '#' + toHex(red) + toHex(green) + toHex(blue)
  }

  private startPingInterval() {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send('PING :tmi.twitch.tv')
      }
    }, 60000) // Ping every 60 seconds
  }

  private stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.config.onStatusChange('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * this.reconnectAttempts

    this.config.onStatusChange(`Reconnecting in ${delay / 1000}s...`)

    setTimeout(() => {
      if (!this.isConnected) {
        this.connect()
      }
    }, delay)
  }

  changeChannel(channel: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      // Leave current channel
      this.ws.send(`PART #${this.config.channel}`)
      
      // Join new channel
      this.config.channel = channel
      this.ws.send(`JOIN #${channel || 'Unknown'}`)
      this.config.onStatusChange(`Connected to ${channel || 'Unknown'}`)
    } else {
      // Update channel and reconnect
      this.config.channel = channel
      this.connect()
    }
  }
}