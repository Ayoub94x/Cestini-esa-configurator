import React from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { AppShell } from './shell'

export function App(): JSX.Element {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppShell />
    </ThemeProvider>
  )
}


