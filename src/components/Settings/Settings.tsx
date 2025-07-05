import React, { useState } from 'react'
import { useChatStore } from '../../store/chatStore'
import { useUIStore } from '../../store/uiStore'
import { useThemeStore } from '../../store/themeStore'
import { useUserFilterStore } from '../../store/userFilterStore'
import styles from './Settings.module.css'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
  changeChannel: (channel: string) => void
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, changeChannel }) => {
  const [channelInput, setChannelInput] = useState('')
  const [showChannelInput, setShowChannelInput] = useState(false)
  const [botUserInput, setBotUserInput] = useState('')
  const [blockedUserInput, setBlockedUserInput] = useState('')
  
  const {
    maxMessages,
    currentChannel,
    disappearingDelay,
    setMaxMessages,
    setCurrentChannel,
    setDisappearingDelay,
    clearMessages
  } = useChatStore()

  const {
    showTimestamps,
    showBadges,
    badgeDisplayMode,
    fontSizeMultiplier,
    borderRadius,
    showHeader,
    showBackground,
    onlyFullyVisible,
    hideCommandMessages,
    setShowTimestamps,
    setShowBadges,
    setBadgeDisplayMode,
    setFontSizeMultiplier,
    setBorderRadius,
    setShowHeader,
    setShowBackground,
    setOnlyFullyVisible,
    setHideCommandMessages
  } = useUIStore()

  const {
    currentThemeName,
    availableThemes,
    switchTheme
  } = useThemeStore()
  
  const {
    botUsers,
    blockedUsers,
    addBotUser,
    removeBotUser,
    addBlockedUser,
    removeBlockedUser
  } = useUserFilterStore()

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
              <label>
                Disappearing delay (ms):
                <span className={styles.tooltip}>
                  <span className={styles.tooltipIcon}>ⓘ</span>
                  <span className={styles.tooltipText}>Messages disappear after this delay (0 = disabled)</span>
                </span>
              </label>
              <input
                type="number"
                min="0"
                max="60000"
                step="1000"
                value={disappearingDelay}
                onChange={(e) => setDisappearingDelay(Number(e.target.value))}
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
            <div className={styles.settingGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={showHeader}
                  onChange={(e) => setShowHeader(e.target.checked)}
                />
                Show header
                <span className={styles.tooltip}>
                  <span className={styles.tooltipIcon}>ⓘ</span>
                  <span className={styles.tooltipText}>Toggle chat header visibility. Query param: ?hd=0 (to disable)</span>
                </span>
              </label>
            </div>
            <div className={styles.settingGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={showBackground}
                  onChange={(e) => setShowBackground(e.target.checked)}
                />
                Show background
                <span className={styles.tooltip}>
                  <span className={styles.tooltipIcon}>ⓘ</span>
                  <span className={styles.tooltipText}>Toggle chat background visibility. Query param: ?bg=0 (to disable)</span>
                </span>
              </label>
            </div>
            <div className={styles.settingGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={hideCommandMessages}
                  onChange={(e) => setHideCommandMessages(e.target.checked)}
                />
                Hide command messages (!)
                <span className={styles.tooltip}>
                  <span className={styles.tooltipIcon}>ⓘ</span>
                  <span className={styles.tooltipText}>Hide messages starting with ! (bot commands). Query param: ?hc=1 (to enable)</span>
                </span>
              </label>
            </div>
            <div className={styles.settingGroup}>
              <label>
                Badge display:
                <span className={styles.tooltip}>
                  <span className={styles.tooltipIcon}>ⓘ</span>
                  <span className={styles.tooltipText}>Show badges as text or images. Query param: ?bdm=image</span>
                </span>
              </label>
              <select
                value={badgeDisplayMode}
                onChange={(e) => setBadgeDisplayMode(e.target.value as 'text' | 'image')}
              >
                <option value="text">Text</option>
                <option value="image">Images</option>
              </select>
            </div>
            <div className={styles.settingGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={onlyFullyVisible}
                  onChange={(e) => setOnlyFullyVisible(e.target.checked)}
                />
                Only show fully visible messages
                <span className={styles.tooltip}>
                  <span className={styles.tooltipIcon}>ⓘ</span>
                  <span className={styles.tooltipText}>Hide partially visible messages at edges. Query param: ?ov=1 (to enable)</span>
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

          {/* User Filtering */}
          <section className={styles.settingsSection}>
            <h3>User Filtering</h3>
            
            {/* Bot Users */}
            <div className={styles.filterSection}>
              <h4>Bot Users (Convert to Notifications)</h4>
              <div className={styles.userList}>
                {botUsers.map((user) => (
                  <div key={user} className={styles.userItem}>
                    <span>{user}</span>
                    <button
                      onClick={() => removeBotUser(user)}
                      className={styles.removeButton}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (botUserInput.trim()) {
                    addBotUser(botUserInput.trim())
                    setBotUserInput('')
                  }
                }}
                className={styles.addUserForm}
              >
                <input
                  type="text"
                  value={botUserInput}
                  onChange={(e) => setBotUserInput(e.target.value)}
                  placeholder="Add bot username"
                  className={styles.userInput}
                />
                <button type="submit" className={styles.addButton}>
                  Add
                </button>
              </form>
            </div>
            
            {/* Blocked Users */}
            <div className={styles.filterSection}>
              <h4>Blocked Users (Hide Messages)</h4>
              <div className={styles.userList}>
                {blockedUsers.map((user) => (
                  <div key={user} className={styles.userItem}>
                    <span>{user}</span>
                    <button
                      onClick={() => removeBlockedUser(user)}
                      className={styles.removeButton}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (blockedUserInput.trim()) {
                    addBlockedUser(blockedUserInput.trim())
                    setBlockedUserInput('')
                  }
                }}
                className={styles.addUserForm}
              >
                <input
                  type="text"
                  value={blockedUserInput}
                  onChange={(e) => setBlockedUserInput(e.target.value)}
                  placeholder="Add blocked username"
                  className={styles.userInput}
                />
                <button type="submit" className={styles.addButton}>
                  Add
                </button>
              </form>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
} 