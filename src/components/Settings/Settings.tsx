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
    messageDelay,
    maxMessages,
    currentChannel,
    setMessageDelay,
    setMaxMessages,
    setCurrentChannel,
    clearMessages
  } = useChatStore()

  const {
    showTimestamps,
    showBadges,
    fontSizeMultiplier,
    setShowTimestamps,
    setShowBadges,
    setFontSizeMultiplier
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
              <label>
                Theme:
                <span className={styles.tooltip}>
                  <span className={styles.tooltipIcon}>ⓘ</span>
                  <span className={styles.tooltipText}>Query param: ?th=themename</span>
                </span>
              </label>
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
            <h3>
              Channel: <strong>{currentChannel}</strong>
              <span className={styles.tooltip}>
                <span className={styles.tooltipIcon}>ⓘ</span>
                <span className={styles.tooltipText}>Query param: ?ch=channelname</span>
              </span>
            </h3>
            <div className={styles.settingGroup} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
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
                Message delay (ms):
                <span className={styles.tooltip}>
                  <span className={styles.tooltipIcon}>ⓘ</span>
                  <span className={styles.tooltipText}>Query param: ?md=1000</span>
                </span>
              </label>
              <input
                type="number"
                min="0"
                max="50000"
                step="10"
                value={messageDelay}
                onChange={(e) => setMessageDelay(Number(e.target.value))}
              />
            </div>
            <div className={styles.settingGroup}>
              <label>
                Max messages:
                <span className={styles.tooltip}>
                  <span className={styles.tooltipIcon}>ⓘ</span>
                  <span className={styles.tooltipText}>Query param: ?mm=150</span>
                </span>
              </label>
              <input
                type="number"
                min="1"
                max="200"
                step="1"
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
                <span className={styles.tooltip}>
                  <span className={styles.tooltipIcon}>ⓘ</span>
                  <span className={styles.tooltipText}>Query param: ?ts=0 (to disable)</span>
                </span>
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
                <span className={styles.tooltip}>
                  <span className={styles.tooltipIcon}>ⓘ</span>
                  <span className={styles.tooltipText}>Query param: ?bd=0 (to disable)</span>
                </span>
              </label>
            </div>
            <div className={styles.settingGroup} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <label>
                  Font size:
                  <span className={styles.tooltip}>
                    <span className={styles.tooltipIcon}>ⓘ</span>
                    <span className={styles.tooltipText}>Query param: ?fs=1.25</span>
                  </span>
                </label>
                <span style={{ fontWeight: '600' }}>{Math.round(fontSizeMultiplier * 100)}%</span>
              </div>
              <div style={{ width: '100%' }}>
                <input
                  type="range"
                  min="1"
                  max="2"
                  step="0.05"
                  value={fontSizeMultiplier}
                  onChange={(e) => setFontSizeMultiplier(Number(e.target.value))}
                  className={styles.slider}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                  <span>100%</span>
                  <span>150%</span>
                  <span>200%</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
} 