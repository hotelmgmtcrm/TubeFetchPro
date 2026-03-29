import React from 'react';

export default function DashboardHome() {
  return (
    <div className="flex flex-col gap-8 p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-2">Manage your video processing tasks with TubeFetch Pro.</p>
        </div>
        <a href="/dashboard/history" className="text-accent font-semibold hover:underline">View History →</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <div className="p-8 border rounded-2xl bg-card shadow-sm hover:shadow-md transition group">
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">Single Video</h3>
          <p className="text-muted-foreground mb-6">Download or convert a single YouTube video to MP4 or MP3 format instantly.</p>
          <a href="/dashboard/single-video" className="block text-center py-3 bg-accent text-white font-bold rounded-lg hover:bg-blue-600 transition">
            Start Processing
          </a>
        </div>

        <div className="p-8 border rounded-2xl bg-card shadow-sm hover:shadow-md transition group">
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">Channel Fetch</h3>
          <p className="text-muted-foreground mb-6">Process all videos from a specific channel or user handle. Ready for testing.</p>
          <a href="/dashboard/channel-fetch" className="block text-center py-3 bg-accent text-white font-bold rounded-lg hover:bg-blue-600 transition">
            Process Channel
          </a>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-accent/5 border border-accent/20 rounded-2xl flex items-center gap-6">
        <div className="text-accent">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-accent">Compliance Reminder</h4>
          <p className="text-sm text-accent/80">TubeFetch Pro filters downloads based on your legal consent. Always ensure you have the rights to the content you process.</p>
        </div>
      </div>
    </div>
  );
}

