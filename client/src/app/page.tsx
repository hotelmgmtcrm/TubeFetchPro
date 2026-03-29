'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import StatusTracker from '@/components/StatusTracker';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:5001/api';

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [videoResult, setVideoResult] = useState<any>(null);
  const [channelData, setChannelData] = useState<any>(null);
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [userJobIds, setUserJobIds] = useState<string[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<any[]>([]);

  useEffect(() => { historyRef.current = history; }, [history]);

  useEffect(() => {
    const saved = localStorage.getItem('tubefetch_jobs');
    if (saved) setUserJobIds(JSON.parse(saved));
    fetchHistory();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (historyRef.current.some(j => ['pending','processing','converting','uploading','validating'].includes(j.status))) fetchHistory();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    try { setHistory((await axios.get(`${API_BASE}/jobs/history`)).data); } catch {}
  };

  const saveIds = (ids: string[]) => {
    const updated = [...userJobIds, ...ids];
    setUserJobIds(updated);
    localStorage.setItem('tubefetch_jobs', JSON.stringify(updated));
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return setError('Paste a YouTube URL to get started.');
    setError(''); setSuccess(''); setLoading(true);
    setVideoResult(null); setChannelData(null); setSelectedVideos(new Set());
    try {
      const res = await axios.post(`${API_BASE}/youtube/channel-videos`, { channelUrl: query });
      if (res.data.fetchedVideos?.length > 1) setChannelData(res.data);
      else if (res.data.fetchedVideos?.length === 1) setVideoResult(res.data.fetchedVideos[0]);
      else setError('Nothing found. Check the URL and try again.');
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Could not connect. Check the URL or try again.');
    } finally { setLoading(false); }
  };

  const clear = () => {
    setQuery(''); setVideoResult(null); setChannelData(null);
    setSelectedVideos(new Set()); setError(''); setSuccess('');
  };

  const download = async (videoId: string, type: 'mp3' | 'mp4', quality = 'high') => {
    setProcessing(true);
    try {
      const res = await axios.post(`${API_BASE}/jobs/create`, {
        sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
        outputType: type, quality, consentAccepted: true,
      });
      saveIds([res.data._id]);
      fetchHistory();
      setSuccess(`Started: ${res.data.title}`);
    } catch { setError('Failed to start download.'); }
    finally { setProcessing(false); }
  };

  const batchDownload = async (type: 'mp3' | 'mp4') => {
    if (!selectedVideos.size || !channelData) return;
    setProcessing(true); setError('');
    try {
      const items = channelData.fetchedVideos
        .filter((v: any) => selectedVideos.has(v.videoId))
        .map((v: any) => ({ sourceUrl: `https://www.youtube.com/watch?v=${v.videoId}`, videoId: v.videoId, title: v.title, thumbnail: v.thumbnail, duration: v.duration }));
      const res = await axios.post(`${API_BASE}/jobs/batch`, { items, outputType: type, quality: 'high', consentAccepted: true });
      saveIds(res.data.jobIds);
      fetchHistory();
      setSuccess(`${res.data.jobIds.length} downloads queued.`);
      setSelectedVideos(new Set());
    } catch { setError('Batch download failed.'); }
    finally { setProcessing(false); }
  };

  const toggleVideo = (id: string) => setSelectedVideos(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => {
    if (!channelData) return;
    const all = channelData.fetchedVideos.map((v: any) => v.videoId);
    setSelectedVideos(prev => prev.size === all.length ? new Set() : new Set(all));
  };

  const deleteJob = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/jobs/${id}`);
      setHistory(prev => prev.filter(h => h._id !== id));
      const updated = userJobIds.filter(j => j !== id);
      setUserJobIds(updated);
      localStorage.setItem('tubefetch_jobs', JSON.stringify(updated));
    } catch {}
  };

  const fmt = (s: number) => s > 0 ? `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}` : '';
  const userJobs = history.filter(h => userJobIds.includes(h._id));
  const globalJobs = history.filter(h => !userJobIds.includes(h._id));

  return (
    <div className="max-w-3xl mx-auto px-5 pt-16 pb-10">

      {/* Logo */}
      <h1 onClick={clear} className="text-2xl font-semibold tracking-tight cursor-pointer mb-8">
        tubefetch
      </h1>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Paste YouTube link here..."
          className="flex-1 h-11 px-4 rounded-lg bg-[#181818] border border-[#282828] text-sm text-white placeholder:text-[#444] outline-none focus:border-[#444] transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-11 px-5 rounded-lg bg-white text-black text-sm font-medium hover:bg-[#ddd] transition-colors disabled:opacity-40"
        >
          {loading ? 'Wait...' : 'Go'}
        </button>
      </form>
      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
      {success && <p className="text-sm text-green-400 mb-4">{success}</p>}

      <div ref={resultsRef}>

        {/* Single video result */}
        {videoResult && (
          <div className="mt-6 bg-[#151515] border border-[#222] rounded-xl overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-64 shrink-0 relative bg-black">
                {videoResult.thumbnail && <img src={videoResult.thumbnail} alt="" className="w-full aspect-video object-cover" />}
                {videoResult.duration > 0 && (
                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 text-[11px] text-white rounded">{fmt(videoResult.duration)}</span>
                )}
              </div>
              <div className="p-4 flex-1">
                <h2 className="text-sm font-medium mb-4 leading-snug">{videoResult.title}</h2>
                <div className="flex gap-6">
                  <div className="flex-1">
                    <p className="text-[11px] text-[#555] mb-2 uppercase tracking-wide">Audio</p>
                    {[{ l: '320kbps', q: 'high' }, { l: '128kbps', q: 'low' }].map(o => (
                      <button key={o.q} onClick={() => download(videoResult.videoId, 'mp3', o.q)} disabled={processing}
                        className="block w-full text-left px-3 py-2 mb-1 text-xs text-[#999] bg-[#1a1a1a] border border-[#252525] rounded hover:border-[#444] hover:text-white transition-colors disabled:opacity-30">
                        MP3 · {o.l}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] text-[#555] mb-2 uppercase tracking-wide">Video</p>
                    {[{ l: '1080p', q: 'high' }, { l: '720p', q: 'medium' }, { l: '480p', q: 'low' }].map(o => (
                      <button key={o.q} onClick={() => download(videoResult.videoId, 'mp4', o.q)} disabled={processing}
                        className="block w-full text-left px-3 py-2 mb-1 text-xs text-[#999] bg-[#1a1a1a] border border-[#252525] rounded hover:border-[#444] hover:text-white transition-colors disabled:opacity-30">
                        MP4 · {o.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Channel results */}
        {channelData && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-medium">{channelData.channelName}</h2>
                <p className="text-xs text-[#555]">
                  {channelData.fetchedVideos.length} videos
                  {selectedVideos.size > 0 && <span className="text-green-500"> · {selectedVideos.size} selected</span>}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={toggleAll} className="px-3 py-1.5 text-[11px] text-[#666] border border-[#282828] rounded hover:text-white hover:border-[#444] transition-colors">
                  {selectedVideos.size === channelData.fetchedVideos.length ? 'Clear' : 'Select all'}
                </button>
                {selectedVideos.size > 0 && (
                  <>
                    <button onClick={() => batchDownload('mp4')} disabled={processing} className="px-3 py-1.5 text-[11px] bg-white text-black font-medium rounded hover:bg-[#ddd] transition-colors disabled:opacity-40">
                      MP4 ({selectedVideos.size})
                    </button>
                    <button onClick={() => batchDownload('mp3')} disabled={processing} className="px-3 py-1.5 text-[11px] bg-[#222] text-white font-medium rounded hover:bg-[#333] transition-colors disabled:opacity-40">
                      MP3 ({selectedVideos.size})
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {channelData.fetchedVideos.map((v: any) => {
                const sel = selectedVideos.has(v.videoId);
                return (
                  <div key={v.videoId} onClick={() => toggleVideo(v.videoId)}
                    className={`rounded-lg overflow-hidden cursor-pointer border transition-colors ${sel ? 'border-green-500/40 bg-green-500/5' : 'border-[#1a1a1a] hover:border-[#333]'}`}>
                    <div className="relative aspect-video bg-black">
                      <img src={v.thumbnail} className="w-full h-full object-cover" alt="" />
                      <div className={`absolute top-1.5 left-1.5 w-4 h-4 rounded-sm border flex items-center justify-center ${sel ? 'bg-green-500 border-green-500' : 'border-[#666] bg-black/60'}`}>
                        {sel && <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                      </div>
                      {v.duration > 0 && <span className="absolute bottom-1 right-1 px-1 py-px bg-black/80 text-[10px] text-white rounded">{fmt(v.duration)}</span>}
                    </div>
                    <div className="p-2 bg-[#141414]">
                      <p className="text-[11px] text-[#aaa] line-clamp-2 leading-relaxed">{v.title}</p>
                      <div className="flex gap-1 mt-2" onClick={e => e.stopPropagation()}>
                        <button onClick={() => download(v.videoId, 'mp4')} disabled={processing} className="flex-1 py-1 text-[10px] text-[#555] bg-[#1a1a1a] rounded hover:text-white transition-colors disabled:opacity-30">MP4</button>
                        <button onClick={() => download(v.videoId, 'mp3')} disabled={processing} className="flex-1 py-1 text-[10px] text-[#555] bg-[#1a1a1a] rounded hover:text-white transition-colors disabled:opacity-30">MP3</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Downloads section */}
        <div className="mt-12">
          <h3 className="text-xs text-[#555] uppercase tracking-wide mb-3">Downloads</h3>

          {userJobs.length === 0 ? (
            <p className="text-sm text-[#333] py-6">Nothing here yet. Paste a link above.</p>
          ) : (
            <div className="space-y-1">
              {userJobs.map(job => (
                <div key={job._id} className="flex items-center gap-3 p-3 bg-[#141414] border border-[#1e1e1e] rounded-lg">
                  <div className="w-16 aspect-video rounded overflow-hidden bg-black shrink-0">
                    {job.thumbnail && <img src={job.thumbnail} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{job.title || 'Untitled'}</p>
                    <p className="text-[11px] text-[#444] mt-0.5">
                      {job.outputType?.toUpperCase()}
                      {job.fileSize ? ` · ${(job.fileSize / 1048576).toFixed(1)} MB` : ''}
                    </p>
                  </div>
                  <div className="w-52 shrink-0">
                    <StatusTracker status={job.status} error={job.errorMessage} downloadUrl={job.downloadUrl} onDelete={() => deleteJob(job._id)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global feed */}
        {globalJobs.length > 0 && (
          <div className="mt-8">
            <h3 className="text-[11px] text-[#333] mb-2">Recent activity</h3>
            <div className="flex flex-wrap gap-1.5">
              {globalJobs.slice(0, 8).map(job => (
                <div key={job._id} className="flex items-center gap-1.5 px-2 py-1 bg-[#141414] rounded text-[11px] text-[#444]">
                  <span className={`w-1.5 h-1.5 rounded-full ${job.status === 'completed' ? 'bg-green-500' : job.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                  <span className="max-w-[120px] truncate">{job.title || 'Untitled'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-[#222] text-xs mt-16">tubefetch</p>
    </div>
  );
}
