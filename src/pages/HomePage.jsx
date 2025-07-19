// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import VideoCard from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const location = useLocation();
  const { loading: authLoading ,user} = useAuth();
  const navigate = useNavigate();

  // read ?query=foo
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query') || "";

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get('/videos', {
          params: {
            query: searchQuery,     // <-- pass the query here
            page: 1,
            limit: 12
          }
        });
        setVideos(res.data.data.videos || []);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Login to view videos');
        if(user==null)
        {
            navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [authLoading, searchQuery,navigate]); // re-fetch when query changes

  if (loading || authLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!videos.length) return <p>No videos found{searchQuery ? ` for "${searchQuery}"` : ""}.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      {searchQuery && (
        <h3 className="mb-4 text-xl">
          Search results for "<strong>{searchQuery}</strong>"
        </h3>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(v => (
          <VideoCard key={v._id} video={v} />
        ))}
      </div>
    </div>
  );
}
