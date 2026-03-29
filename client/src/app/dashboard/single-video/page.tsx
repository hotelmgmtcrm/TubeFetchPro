'use client';
import React, { useState } from 'react';
import axios from 'axios';
import StatusTracker from '@/components/StatusTracker';

export default function SingleVideoPage() {
  const [url, setUrl] = useState('');
  const [outputType, setOutputType] = useState('mp4');
  const [customFilename, setCustomFilename] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError('You must accept the legal consent to proceed.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/jobs/create', {
        sourceUrl: url,
        outputType,
        quality: 'high',
        customFilename,
        consentAccepted: true,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJob(response.data);
      setUrl('');
      setCustomFilename('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <h2 className="text-3xl font-bold mb-8 text-foreground">Process Single Video</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border border-secondary/50 shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-2">YouTube URL</label>
          <input 
            type="url" 
            required
            className="w-full p-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-accent outline-none"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Output Format</label>
            <select 
              className="w-full p-3 rounded-lg border bg-background text-foreground"
              value={outputType}
              onChange={(e) => setOutputType(e.target.value)}
            >
              <option value="mp4">Video (MP4)</option>
              <option value="mp3">Audio (MP3)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Custom Filename (Optional)</label>
            <input 
              type="text"
              className="w-full p-3 rounded-lg border bg-background text-foreground"
              placeholder="my_video"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg border border-yellow-500/30">
          <label className="flex items-start gap-4 cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-1 w-5 h-5 accent-accent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span className="text-sm text-muted-foreground leading-relaxed">
              I certify that I have the legal authority to download and process this content, or that the content is in the public domain/Creative Commons. 
              <strong> TubeFetch Pro is for legal use only.</strong>
            </span>
          </label>
        </div>

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-accent text-white font-bold rounded-lg hover:bg-blue-600 disabled:opacity-50 transition shadow-lg"
        >
          {loading ? 'Initiating...' : 'Start Processing'}
        </button>
      </form>

      {job && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Current Task</h3>
          <StatusTracker 
            status={job.status} 
            error={job.errorDetails} 
            downloadUrl={job.downloadUrl} 
          />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Job ID: {job._id}
          </p>
        </div>
      )}
    </div>
  );
}
