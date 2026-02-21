import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WebSocketProvider } from './contexts/WebSocketContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WebSocketProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </WebSocketProvider>
  </React.StrictMode>
)