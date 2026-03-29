import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'TubeFetch - YouTube Downloader',
  description: 'Download YouTube videos and audio easily.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={`${outfit.className} bg-[#0f0f0f] text-[#e8e8e8] min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  )
}
