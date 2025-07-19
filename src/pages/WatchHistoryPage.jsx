// src/pages/WatchHistory.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import VideoCard from '../components/VideoCard';

export default function WatchHistoryPage() {
  const [historyVideos, setHistoryVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get('/users/history');
        setHistoryVideos(res.data.data);
      } catch (err) {
        console.error('Failed to fetch watch history:', err);
        setError('Failed to load watch history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-6">Your Watch History</h2>

      {loading ? (
        <p className="text-gray-300">Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : historyVideos.length === 0 ? (
        <p className="text-gray-400">You haven\'t watched any videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {historyVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
