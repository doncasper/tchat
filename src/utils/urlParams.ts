// Simple URL parameter utilities without React hooks to avoid circular dependencies

export const readSettingsFromURL = () => {
  const params = new URLSearchParams(window.location.search)
  
  return {
    channel: params.get('ch'),
    theme: params.get('th'),
    autoScroll: params.get('as') !== null ? params.get('as') === '1' : null,
    showTimestamps: params.get('ts') !== null ? params.get('ts') === '1' : null,
    showBadges: params.get('bd') !== null ? params.get('bd') === '1' : null,
    fontSizeMultiplier: params.get('fs') ? parseFloat(params.get('fs')!) : null,
    messageDelay: params.get('md') ? parseInt(params.get('md')!, 10) : null,
    maxMessages: params.get('mm') ? parseInt(params.get('mm')!, 10) : null
  }
}

export const updateURLWithSettings = (settings: {
  channel?: string
  theme?: string
  autoScroll?: boolean
  showTimestamps?: boolean
  showBadges?: boolean
  fontSizeMultiplier?: number
  messageDelay?: number
  maxMessages?: number
}) => {
  const params = new URLSearchParams()

  // Only add non-default values
  if (settings.channel && settings.channel !== 'lirik') {
    params.set('ch', settings.channel)
  }
  if (settings.theme && settings.theme !== 'default') {
    params.set('th', settings.theme)
  }
  if (settings.autoScroll === false) {
    params.set('as', '0')
  }
  if (settings.showTimestamps === false) {
    params.set('ts', '0')
  }
  if (settings.showBadges === false) {
    params.set('bd', '0')
  }
  if (settings.fontSizeMultiplier && settings.fontSizeMultiplier !== 1) {
    params.set('fs', settings.fontSizeMultiplier.toFixed(2))
  }
  if (settings.messageDelay && settings.messageDelay !== 0) {
    params.set('md', settings.messageDelay.toString())
  }
  if (settings.maxMessages && settings.maxMessages !== 100) {
    params.set('mm', settings.maxMessages.toString())
  }

  const newURL = params.toString() 
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname

  window.history.replaceState({}, '', newURL)
}