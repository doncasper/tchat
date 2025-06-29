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
    borderRadius,
    setShowTimestamps,
    setShowBadges,
    setFontSizeMultiplier,
    setBorderRadius
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
          {/* Channel Settings */}
          <section className={styles.settingsSection}>
            <h3>
              Channel: <strong>{currentChannel}</strong>
              <span className={styles.tooltip}>
                <span className={styles.tooltipIcon}>ⓘ</span>
                <span className={styles.tooltipText}>Query param: ?ch=channelname</span>
              </span>
            </h3>
            <div className={`${styles.settingGroup} ${styles.settingGroupColumn}`}>
              {showChannelInput ? (
                <form onSubmit={handleChannelSubmit} className={styles.channelForm}>
                  <input
                    type="text"
                    value={channelInput}
                    onChange={(e) => setChannelInput(e.target.value)}
                    placeholder="Channel name"
                    className={styles.channelInput}
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
                  className={`${styles.primaryButton} ${styles.changeChannelButton}`}
                >
                  Change Channel
                </button>
              )}
            </div>
          </section>

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
            <div className={`${styles.settingGroup} ${styles.fontSizeSection}`}>
              <div className={styles.fontSizeHeader}>
                <label>
                  Font size:
                  <span className={styles.tooltip}>
                    <span className={styles.tooltipIcon}>ⓘ</span>
                    <span className={styles.tooltipText}>Query param: ?fs=1.25</span>
                  </span>
                </label>
                <span className={styles.fontSizeValue}>{Math.round(fontSizeMultiplier * 100)}%</span>
              </div>
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="1"
                  max="2"
                  step="0.05"
                  value={fontSizeMultiplier}
                  onChange={(e) => setFontSizeMultiplier(Number(e.target.value))}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>100%</span>
                  <span>150%</span>
                  <span>200%</span>
                </div>
              </div>
            </div>
            <div className={`${styles.settingGroup} ${styles.fontSizeSection}`}>
              <div className={styles.fontSizeHeader}>
                <label>
                  Border radius:
                  <span className={styles.tooltip}>
                    <span className={styles.tooltipIcon}>ⓘ</span>
                    <span className={styles.tooltipText}>Rounded corners for the chat container</span>
                  </span>
                </label>
                <span className={styles.fontSizeValue}>{borderRadius}px</span>
              </div>
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>0px</span>
                  <span>15px</span>
                  <span>30px</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
} 