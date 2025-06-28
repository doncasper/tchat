import React, { useState } from 'react'
import { useChatStore } from '../../store/chatStore'
import { useUIStore } from '../../store/uiStore'
import { useThemeStore } from '../../store/themeStore'
import styles from './Settings.module.css'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
  changeChannel: (channel: string) => void
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, changeChannel }) => {
  const [channelInput, setChannelInput] = useState('')
  const [showChannelInput, setShowChannelInput] = useState(false)
  const {
    autoScroll,
    messageDelay,
    maxMessages,
    currentChannel,
    setAutoScroll,
    setMessageDelay,
    setMaxMessages,
    setCurrentChannel,
    clearMessages
  } = useChatStore()

  const {
    showTimestamps,
    showBadges,
    fontSize,
    setShowTimestamps,
    setShowBadges,
    setFontSize
  } = useUIStore()

  const {
    currentThemeName,
    availableThemes,
    switchTheme
  } = useThemeStore()

  const handleChannelSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedChannel = channelInput.trim()
    if (trimmedChannel && trimmedChannel !== currentChannel) {
      setCurrentChannel(trimmedChannel)
      changeChannel(trimmedChannel)
      setChannelInput('')
      setShowChannelInput(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.settingsOverlay} onClick={onClose}>
      <div className={styles.settingsModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.settingsHeader}>
          <h2>Settings</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.settingsContent}>
          {/* Theme Settings */}
          <section className={styles.settingsSection}>
            <h3>Theme</h3>
            <div className={styles.settingGroup}>
              <label>Theme:</label>
              <select
                value={currentThemeName}
                onChange={(e) => switchTheme(e.target.value)}
              >
                {availableThemes.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Channel Settings */}
          <section className={styles.settingsSection}>
            <h3>Channel</h3>
            <div className={styles.settingGroup} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <label>Current channel: <strong>{currentChannel}</strong></label>
              {showChannelInput ? (
                <form onSubmit={handleChannelSubmit} style={{ display: 'flex', gap: '8px', marginTop: '8px', width: '100%' }}>
                  <input
                    type="text"
                    value={channelInput}
                    onChange={(e) => setChannelInput(e.target.value)}
                    placeholder="Channel name"
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      fontSize: '14px'
                    }}
                    autoFocus
                  />
                  <button type="submit" className={styles.primaryButton}>
                    Join
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowChannelInput(false)} 
                    className={styles.secondaryButton}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button 
                  onClick={() => setShowChannelInput(true)} 
                  className={styles.primaryButton}
                  style={{ marginTop: '8px' }}
                >
                  Change Channel
                </button>
              )}
            </div>
          </section>

          {/* Chat Settings */}
          <section className={styles.settingsSection}>
            <h3>Chat</h3>
            <div className={styles.settingGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                />
                Auto-scroll to bottom
              </label>
            </div>
            <div className={styles.settingGroup}>
              <label>Message delay (ms):</label>
              <input
                type="number"
                min="0"
                max="5000"
                step="100"
                value={messageDelay}
                onChange={(e) => setMessageDelay(Number(e.target.value))}
              />
            </div>
            <div className={styles.settingGroup}>
              <label>Max messages:</label>
              <input
                type="number"
                min="100"
                max="10000"
                step="100"
                value={maxMessages}
                onChange={(e) => setMaxMessages(Number(e.target.value))}
              />
            </div>
            <div className={styles.settingGroup}>
              <button
                className={styles.dangerButton}
                onClick={clearMessages}
              >
                Clear All Messages
              </button>
            </div>
          </section>

          {/* Display Settings */}
          <section className={styles.settingsSection}>
            <h3>Display</h3>
            <div className={styles.settingGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={showTimestamps}
                  onChange={(e) => setShowTimestamps(e.target.checked)}
                />
                Show timestamps
              </label>
            </div>
            <div className={styles.settingGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={showBadges}
                  onChange={(e) => setShowBadges(e.target.checked)}
                />
                Show badges
              </label>
            </div>
            <div className={styles.settingGroup}>
              <label>Font size:</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large')}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
} 