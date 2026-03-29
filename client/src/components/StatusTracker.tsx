'use client';
import React from 'react';

type Status = 'pending' | 'validating' | 'processing' | 'converting' | 'uploading' | 'completed' | 'failed';

interface StatusTrackerProps {
  status: Status;
  error?: string;
  downloadUrl?: string;
  onDelete?: () => void;
}

const STEPS = ['Queued', 'Downloading', 'Converting', 'Uploading', 'Done'];

function getStepIndex(status: Status): number {
  const map: Record<string, number> = {
    pending: 0, validating: 0, processing: 1, converting: 2, uploading: 3, completed: 4,
  };
  return map[status] ?? -1;
}

export default function StatusTracker({ status, error, downloadUrl, onDelete }: StatusTrackerProps) {
  const step = getStepIndex(status);
  const failed = status === 'failed';
  const done = status === 'completed';

  return (
    <div>
      {!failed && (
        <div className="flex gap-[3px] mb-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-[3px] rounded-full ${
                i <= step ? 'bg-green-500' : 'bg-[#222]'
              } ${i === step && !done ? 'animate-pulse' : ''}`} />
              <p className={`text-[9px] mt-1 ${i <= step ? 'text-[#888]' : 'text-[#333]'}`}>{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        {done && downloadUrl ? (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-1.5 bg-green-500 text-black text-xs font-medium rounded hover:bg-green-400 transition-colors"
          >
            Download
          </a>
        ) : failed ? (
          <span className="text-xs text-red-400">{error || 'Failed'}</span>
        ) : (
          <span className="text-xs text-[#555]">{status}...</span>
        )}
        <div className="flex-1" />
        {onDelete && (
          <button onClick={onDelete} className="text-[#333] hover:text-red-400 transition-colors" title="Remove">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}
