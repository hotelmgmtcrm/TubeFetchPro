import React from 'react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h2 className="text-5xl font-extrabold tracking-tight mb-6">
        Safely Processing <span className="text-accent underline decoration-wavy">Permitted</span> Video Content
      </h2>
      <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300 mb-8">
        TubeFetch Pro allows you to process, extract, and convert video links from single URLs or entire channels.
        Supported use cases include public domain content and creative commons.
      </p>
      
      <div className="flex gap-4">
        <a href="/dashboard/single-video" className="px-6 py-3 bg-accent text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-600 transition">
          Process a Single Video
        </a>
        <a href="/dashboard/channel-fetch" className="px-6 py-3 bg-secondary text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-700 transition">
          Process a Channel
        </a>
      </div>
    </div>
  );
}
