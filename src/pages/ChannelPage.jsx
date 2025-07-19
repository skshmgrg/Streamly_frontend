// src/pages/ChannelStatsPage.jsx
import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import VideoCard from '../components/VideoCard';

export default function ChannelStatsPage() {
  // const { userId } = useParams();
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [error, setError] = useState(null);

  // Fetch channel stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const res = await axiosInstance.get('/dashboard/stats/');
        setStats(res.data.data);
      } catch (err) {
        console.error('Error fetching channel stats:', err);
        setError('Failed to load channel stats.');
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch channel videos (first page, 12 items)
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoadingVideos(true);
        const res = await axiosInstance.get(`/dashboard/videos/`);
        setVideos(res.data.data.videos);
      } catch (err) {
        console.error('Error fetching channel videos:', err);
        setError('Failed to load channel videos.');
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchVideos();
  }, []);

  if (loadingStats || loadingVideos) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading channel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Channel Header */}
      <div className="flex items-center space-x-6 mb-8">
        <img
          src={stats.avatar}
          alt={stats.username}
          className="w-20 h-20 rounded-full border-2 border-blue-600"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.username}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {stats.subscriberCount} subscribers
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Videos
          </h2>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.videoCount}
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Total Views
          </h2>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
            {/* If you later add total view count in stats, replace the zero */}
            {stats.viewCount ?? 0}
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Likes
          </h2>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.likeCount}
          </p>
        </div>
      </div>

      {/* Video Grid */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Latest Videos
      </h2>
      {videos.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          This channel has no videos yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
