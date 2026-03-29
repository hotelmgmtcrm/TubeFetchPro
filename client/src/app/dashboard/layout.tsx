'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-accent tracking-tighter">TubeFetch Pro</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${pathname === '/dashboard' ? 'bg-accent text-white' : 'text-muted-foreground hover:bg-muted'}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/dashboard/single-video" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${pathname === '/dashboard/single-video' ? 'bg-accent text-white' : 'text-muted-foreground hover:bg-muted'}`}
          >
            Single Video
          </Link>
          <Link 
            href="/dashboard/channel-fetch" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${pathname === '/dashboard/channel-fetch' ? 'bg-accent text-white' : 'text-muted-foreground hover:bg-muted'}`}
          >
            Channel Fetch
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background/50">
        <header className="h-16 border-b bg-card/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
          <span className="text-sm font-medium text-muted-foreground">TubeFetch Pro v1.0</span>
          <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold shadow-sm">
            T
          </div>
        </header>
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
}
