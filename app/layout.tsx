import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Configuratore Cestini ESA',
    template: '%s | Configuratore Cestini ESA'
  },
  description: 'Configuratore online per cestini portarifiuti ESA. Personalizza dimensioni, colori e accessori per i tuoi cestini urbani.',
  keywords: ['cestini', 'portarifiuti', 'urbani', 'ESA', 'configuratore', 'personalizzazione'],
  authors: [{ name: 'Ecologia Soluzione Ambiente S.p.A.' }],
  creator: 'Ecologia Soluzione Ambiente S.p.A.',
  publisher: 'Ecologia Soluzione Ambiente S.p.A.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    title: 'Configuratore Cestini ESA',
    description: 'Configuratore online per cestini portarifiuti ESA. Personalizza dimensioni, colori e accessori.',
    siteName: 'Configuratore Cestini ESA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Configuratore Cestini ESA',
    description: 'Configuratore online per cestini portarifiuti ESA',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
