import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { AuthProvider } from './AuthContext' // استيراد AuthProvider

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider> {/* تغليف App بـ AuthProvider هنا */}
        <PayPalScriptProvider
          options={{
            "client-id": "AVkAV_89lXJ7o21oN3kaN7ZS0KhHcOvVyi3hKqD9Fr1ktFKiYBT6Steg37ZREgHOa7WL00YgDJHWvDjq",
            currency: "USD",
          }}
        >
          <App />
        </PayPalScriptProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)