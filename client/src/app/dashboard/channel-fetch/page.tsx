'use client';
import React, { useState } from 'react';
import axios from 'axios';

export default function ChannelFetchPage() {
  const [url, setUrl] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [channelData, setChannelData] = useState<any>(null);
  const [error, setError] = useState('');

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError('You must accept the legal consent to proceed.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/youtube/channel-videos', {
        channelUrl: url,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChannelData(response.data);
      setUrl(''); // Clear input
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to scan channel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h2 className="text-3xl font-bold mb-8 text-foreground">Channel Scan & Fetch</h2>
      
      <form onSubmit={handleScan} className="space-y-6 bg-card p-6 rounded-xl border border-secondary/50 shadow-sm mb-12">
        <div>
          <label className="block text-sm font-medium mb-2">YouTube Channel URL or @Handle</label>
          <input 
            type="text" 
            required
            className="w-full p-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-accent outline-none"
            placeholder="https://www.youtube.com/@supercdrama"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
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
              I certify that I have the legal authority to process content from this channel. 
              <strong> TubeFetch Pro verifies consent for all channel scans.</strong>
            </span>
          </label>
        </div>

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-accent text-white font-bold rounded-lg hover:bg-blue-600 disabled:opacity-50 transition shadow-lg"
        >
          {loading ? 'Scanning Channel...' : 'Scan Channel'}
        </button>
      </form>

      {channelData && (
        <div className="bg-card p-6 rounded-xl border border-secondary/50 shadow-sm">
          <h3 className="text-xl font-bold mb-6">Found Videos: {channelData.channelName}</h3>
          <div className="space-y-4">
            {channelData.fetchedVideos.map((video: any) => (
              <div key={video.videoId} className="flex justify-between items-center p-4 border rounded-lg bg-background/50">
                <div>
                  <h4 className="font-semibold">{video.title}</h4>
                  <p className="text-xs text-muted-foreground">ID: {video.videoId} | Duration: {video.duration}s</p>
                </div>
                <button className="px-4 py-2 bg-accent/10 text-accent hover:bg-accent hover:text-white rounded-md transition text-sm font-bold">
                  Process Video
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
