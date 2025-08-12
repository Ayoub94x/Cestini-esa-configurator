import React, { type JSX } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { AppShell } from './shell'

export function App(): JSX.Element {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="cestini-theme"
      disableTransitionOnChange
    >
      <AppShell />
    </ThemeProvider>
  )
}


