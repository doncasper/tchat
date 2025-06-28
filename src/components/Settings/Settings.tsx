import React from 'react'
import { useChatStore } from '../../store/chatStore'
import { useUIStore } from '../../store/uiStore'
import { useThemeStore } from '../../store/themeStore'
import styles from './Settings.module.css'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const {
    autoScroll,
    messageDelay,
    maxMessages,
    setAutoScroll,
    setMessageDelay,
    setMaxMessages,
    clearMessages
  } = useChatStore()

  const {
    showTimestamps,
    showBadges,
    compactMode,
    fontSize,
    setShowTimestamps,
    setShowBadges,
    setCompactMode,
    setFontSize
  } = useUIStore()

  const {
    currentThemeName,
    availableThemes,
    switchTheme
  } = useThemeStore()

  // Get theme-specific animation class
  const getThemeAnimationClass = () => {
    switch (currentThemeName) {
      case 'tako':
        return 'tako-settingsmodal'
      case 'minimal':
        return '' // Minimal theme has no animations
      default:
        return 'default-settingsmodal'
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.settingsOverlay} onClick={onClose}>
      <div className={`${styles.settingsModal} ${getThemeAnimationClass()}`} onClick={(e) => e.stopPropagation()}>
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
              <label>
                <input
                  type="checkbox"
                  checked={compactMode}
                  onChange={(e) => setCompactMode(e.target.checked)}
                />
                Compact mode
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