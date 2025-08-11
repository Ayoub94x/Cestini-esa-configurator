import React from 'react'
import { Header } from '@/components/header'
import { Configurator } from '@/components/configurator'

export function AppShell(): JSX.Element {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <Configurator />
      </main>
      <footer className="bg-white border-t py-4 px-6 text-center text-xs text-gray-500">
        <p>Prezzi netti, i.v.a. esclusa.</p>
        <p>Ecologia Soluzione Ambiente S.p.A. - P.IVA IT01494430356</p>
      </footer>
    </div>
  )
}


