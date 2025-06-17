import type { ReactNode } from 'react'
import type { ThemeComponent } from '../ThemeInterface'
import styles from './Header.module.css'

interface HeaderProps {
  streamTitle: string
  viewerCount: number
  onSettingsClick: () => void
  onThemeSwitch: (theme: string) => void
  currentTheme: string
  availableThemes: string[]
}

const Header: ThemeComponent = {
  render: (props: HeaderProps): ReactNode => {
    const { streamTitle, viewerCount, onSettingsClick, onThemeSwitch, currentTheme, availableThemes } = props
    
    return (
      <header className={styles.chatHeader}>
        <div className={styles.headerContent}>
          <div className={styles.streamInfo}>
            <h1 className={styles.neonText}>{streamTitle}</h1>
            <div className={styles.streamStatus}>
              <span className={styles.liveIndicator}>● LIVE</span>
              <span className={styles.viewerCount}>{viewerCount.toLocaleString()} viewers</span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.themeSwitcher}>
              {availableThemes.map((theme) => (
                <button
                  key={theme}
                  className={`${styles.themeBtn} ${currentTheme === theme ? styles.active : ''}`}
                  onClick={() => onThemeSwitch(theme)}
                  title={`Switch to ${theme} theme`}
                >
                  {theme === 'default' ? '🌙' : '⚡'}
                </button>
              ))}
            </div>
            <button className={`${styles.settingsBtn}`} onClick={onSettingsClick}>
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