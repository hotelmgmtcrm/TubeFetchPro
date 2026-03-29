import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-red-600">Admin Control Panel</h1>
        <a href="/dashboard" className="text-sm font-medium hover:underline">Back to App</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <div className="p-4 bg-white dark:bg-black border rounded shadow">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold">142</p>
        </div>
        <div className="p-4 bg-white dark:bg-black border rounded shadow">
          <p className="text-sm text-gray-500">Total Jobs</p>
          <p className="text-2xl font-bold">1,402</p>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded shadow">
          <p className="text-sm text-red-500">Failed Jobs</p>
          <p className="text-2xl font-bold text-red-600">23</p>
        </div>
        <div className="p-4 bg-white dark:bg-black border rounded shadow">
          <p className="text-sm text-gray-500">Storage Used</p>
          <p className="text-2xl font-bold text-blue-600">84.2 GB</p>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Recent Flags & Suspensions</h2>
          <div className="text-sm text-gray-500">No recent suspensions. System looks clean.</div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">System Logs</h2>
          <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded text-xs font-mono h-48 overflow-y-auto">
            <p>[INFO] Server started on port 5000</p>
            <p>[INFO] DB connected successfully</p>
            <p>[WARN] Rate limit triggered by 192.168.1.1</p>
            <p>[INFO] Job #2394 completed - MP4 1080p</p>
          </div>
        </section>
      </div>
    </div>
  );
}
