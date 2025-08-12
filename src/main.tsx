import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './root'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AdminPage } from '@/src/routes/admin'
import '@/app/globals.css'
import { loadPricingData } from '@/lib/pricing-loader'

// Load dynamic pricing data (non-blocking)
void loadPricingData()

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/admin', element: <AdminPage /> },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)


