import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Poplar Labs - Community-Owned Network Villages',
  description: 'Build decentralized villages on secure land registries, create community-owned economies, and enable community lending for home ownership.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
