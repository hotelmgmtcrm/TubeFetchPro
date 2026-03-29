'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatusTracker from '@/components/StatusTracker';

export default function HistoryPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs/history');
        setJobs(response.data);
      } catch (err: any) {
        setError('Failed to fetch job history.');
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
    
    // Poll for status updates every 10 seconds if there are pending/processing jobs
    const interval = setInterval(async () => {
      const hasActiveJobs = jobs.some(job => job.status === 'pending' || job.status === 'processing');
      if (hasActiveJobs) {
        try {
          const response = await axios.get('http://localhost:5000/api/jobs/history');
          setJobs(response.data);
        } catch (err) {
          console.error('Polling error:', err);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [jobs.length]);

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h2 className="text-3xl font-bold mb-8 text-foreground">Job History</h2>

      {loading && <p className="text-center py-10 text-muted-foreground animate-pulse">Loading history...</p>}
      {error && <p className="text-center py-10 text-red-500 font-medium">{error}</p>}
      
      {!loading && jobs.length === 0 && (
        <div className="text-center py-24 bg-card rounded-xl border border-dashed border-muted-foreground/30">
          <p className="text-muted-foreground mb-4 italic">No jobs started yet.</p>
          <a href="/dashboard/single-video" className="text-accent underline hover:text-blue-600 transition font-medium">
            Start Your First Job
          </a>
        </div>
      )}

      <div className="grid gap-6">
        {jobs.map((job) => (
          <div key={job._id} className="bg-card p-6 rounded-xl border border-secondary/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition hover:border-accent/40">
            <div className="flex-1 space-y-1">
              <h4 className="font-bold text-lg text-foreground line-clamp-1">{job.title || 'Unknown Title'}</h4>
              <p className="text-xs text-muted-foreground font-mono truncate max-w-md">{job.sourceUrl}</p>
              <div className="flex gap-4 mt-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                <span>Type: {job.outputType}</span>
                <span>Created: {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="w-full md:w-64">
              <StatusTracker 
                status={job.status} 
                error={job.errorDetails} 
                downloadUrl={job.downloadUrl} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
