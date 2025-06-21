import type { ReactNode } from 'react'
import type { ThemeComponent, HeaderProps } from '../ThemeInterface'
import styles from './Header.module.css'



const Header: ThemeComponent = {
  render: (props: HeaderProps): ReactNode => {
    const { streamTitle, viewerCount, onSettingsClick, onThemeSwitch, currentTheme, availableThemes } = props
    
    return (
      <header className={styles.chatHeader}>
        <div className={styles.headerContent}>
          <div className={styles.streamInfo}>
            <h1>{streamTitle}</h1>
            <div className={styles.streamStatus}>
              <span className={styles.liveIndicator}>● LIVE</span>
              <span className={styles.viewerCount}>{viewerCount.toLocaleString()} viewers</span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.themeSwitcher}>
              <select
                className={styles.themeDropdown}
                value={currentTheme}
                onChange={(e) => onThemeSwitch(e.target.value)}
                title="Select theme"
              >
                {availableThemes.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme === 'default' ? '🌙 Default' : theme === 'neon' ? '⚡ Neon' : theme === 'tako' ? '🎨 Tako' : theme}
                  </option>
                ))}
              </select>
            </div>
            <button className={styles.settingsBtn} onClick={onSettingsClick}>
              ⚙️
            </button>
          </div>
        </div>
      </header>
    )
  },
  styles: ''
}

export default Header 