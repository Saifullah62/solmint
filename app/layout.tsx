import './globals.css'
import type { Metadata } from 'next'
import { Sora, Inter } from 'next/font/google'
import ClientLayout from '@/app/ClientLayout'

// Load Sora font for headings
const sora = Sora({ 
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

// Load Inter font for body text
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SOLMINT - Create. Launch. Thrive.',
  description: 'Create Solana SPL tokens with zero code. The easiest way to launch your token on Solana.',
  keywords: 'solana, spl token, token creator, crypto, blockchain, web3, no-code',
  authors: [{ name: 'SOLMINT Team' }],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://solmint.io',
    title: 'SOLMINT - Create. Launch. Thrive.',
    description: 'Create Solana SPL tokens with zero code. The easiest way to launch your token on Solana.',
    siteName: 'SOLMINT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SOLMINT - Create. Launch. Thrive.',
    description: 'Create Solana SPL tokens with zero code. The easiest way to launch your token on Solana.',
    creator: '@solmint',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
