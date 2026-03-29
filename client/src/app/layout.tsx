import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TubeFetch Pro - Premium Video Processor',
  description: 'Download, convert, and process public domain or creator-permitted video content safely.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background text-foreground flex flex-col">
        <header className="border-b border-secondary/50 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-accent">TubeFetch Pro</h1>
            <nav className="flex gap-4 text-sm font-medium items-center">
              <a href="/login" className="hover:text-accent transition">Login</a>
              <a href="/dashboard" className="px-4 py-2 bg-accent text-white rounded-xl font-bold shadow-sm hover:shadow transition">
                Go to Dashboard
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
        
        <footer className="border-t border-secondary/50 p-6 text-center text-sm text-gray-500 mt-auto">
           TubeFetch Pro is strictly for downloading legally permitted user-owned or creative commons content.
        </footer>
      </body>
    </html>
  )
}
