'use client';
import React from 'react';

type Status = 'pending' | 'processing' | 'completed' | 'failed';

interface StatusTrackerProps {
  status: Status;
  error?: string;
  downloadUrl?: string;
}

export default function StatusTracker({ status, error, downloadUrl }: StatusTrackerProps) {
  const statusColors = {
    pending: 'bg-yellow-500',
    processing: 'bg-blue-500',
    completed: 'bg-green-500',
    failed: 'bg-red-500',
  };

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg bg-card shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
        <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${statusColors[status]}`}>
          {status}
        </span>
      </div>
      
      {status === 'processing' && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-2">
           <div className="bg-blue-600 h-1.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      )}

      {status === 'completed' && downloadUrl && (
        <a 
          href={downloadUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mt-2 block text-center py-2 bg-accent text-white rounded-md font-medium hover:bg-blue-600 transition shadow-sm"
        >
          Download Result
        </a>
      )}

      {status === 'failed' && error && (
        <p className="text-xs text-red-500 mt-1 italic">
          Error: {error}
        </p>
      )}
    </div>
  );
}
