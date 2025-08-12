import React, { type JSX } from 'react'
import { Header } from '@/components/header'
import { Configurator } from '@/components/configurator'

export function AppShell(): JSX.Element {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Configurator />
      </main>
      <footer className="bg-background border-t py-4 px-3 sm:px-6 text-center text-[11px] sm:text-xs text-muted-foreground">
        <p>Prezzi netti, i.v.a. esclusa.</p>
        <p>Ecologia Soluzione Ambiente S.p.A. - P.IVA IT01494430356</p>
      </footer>
    </div>
  )
}


