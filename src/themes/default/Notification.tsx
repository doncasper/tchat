import type { ReactNode } from 'react'
import type { ThemeComponent, NotificationProps } from '../ThemeInterface'
import { useUIStore } from '../../store/uiStore'
import styles from './Notification.module.css'

const NotificationComponent = (props: NotificationProps): ReactNode => {
  const { notification } = props
  const { fontSizeMultiplier } = useUIStore()
  
  return (
    <div 
      className={`${styles.notification} ${styles[notification.userType || '']}`}
      style={{ fontSize: `${fontSizeMultiplier}em` }}
    >
      <div className={styles.notificationContent}>
        {notification.text}
      </div>
    </div>
  )
}

const Notification: ThemeComponent = {
  render: NotificationComponent,
  styles: ''
}

export default Notification 