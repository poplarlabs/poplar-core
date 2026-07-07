import type { Metadata } from 'next'
import { Inter, Young_Serif, IBM_Plex_Mono } from 'next/font/google'
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const youngSerif = Young_Serif({ weight: '400', subsets: ['latin'], variable: '--font-display' })
const plexMono = IBM_Plex_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  metadataBase: new URL('https://poplarlabs.xyz'),
  title: 'Poplar — A hometown you choose',
  description: 'Poplar helps communities put down shared roots: real land, community lending, and a say in what grows. Members anywhere. Roots in one place.',
  openGraph: {
    title: 'Poplar — A hometown you choose',
    description: 'Poplar helps communities put down shared roots: real land, community lending, and a say in what grows. Members anywhere. Roots in one place.',
    url: 'https://poplarlabs.xyz',
    siteName: 'Poplar',
    images: [{ url: '/images/hero-path.png', width: 1200, height: 900, alt: 'A winding path through a village among poplar trees' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Poplar — A hometown you choose',
    description: 'Communities with shared roots: real land, community lending, and a say in what grows.',
    images: ['/images/hero-path.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${youngSerif.variable} ${plexMono.variable}`}>
      <head>
        <link rel="icon" href="/images/logo-transparent.png" sizes="any" />
        <link rel="apple-touch-icon" href="/images/logo-transparent.png" />
        <Script
          id="launchlist-widget-script"
          src="https://getlaunchlist.com/js/widget-diy.js"
          strategy="afterInteractive"
          defer
        />
      </head>
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
