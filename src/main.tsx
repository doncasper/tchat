import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './themes' // Import to trigger theme registration
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
