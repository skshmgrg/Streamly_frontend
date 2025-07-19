// src/components/VideoCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function VideoCard({ video }) {
  const formatViews = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    return Math.floor(seconds) + ' seconds ago';
  };

  const formatDuration = (seconds) => {
    if (typeof seconds !== 'number' || isNaN(seconds)) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const parts = [m, s].map(v => v < 10 ? '0' + v : v);
    if (h > 0) parts.unshift(h < 10 ? '0' + h : h);
    return parts.join(':');
  };

  const placeholderThumbnail = `https://placehold.co/320x180/000000/FFFFFF?text=Video`;
  const placeholderAvatar = `https://placehold.co/40x40/000000/FFFFFF?text=AV`;

  return (
    <Link to={`/watch/${video._id}`} onClick={() => handleVideoClick(video)} className="block w-full rounded-lg overflow-hidden transition-transform duration-200 hover:scale-105">
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Video Thumbnail */}
        <div className="relative w-full aspect-video">
          <img
            src={video.thumbnail || placeholderThumbnail}
            alt={video.title}
            className="w-full h-full object-cover rounded-t-lg"
            onError={(e) => { e.target.onerror = null; e.target.src = placeholderThumbnail; }}
          />
          {video.duration && (
            <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded-md">
              {formatDuration(video.duration)}
            </span>
          )}
        </div>

        {/* Video Details */}
        <div className="p-3 flex space-x-3">
          {/* Channel Avatar */}
          <div className="flex-shrink-0">
            <img
              src={video.owner?.avatar || placeholderAvatar}
              alt={video.owner?.username || 'Channel'}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = placeholderAvatar; }}
            />
          </div>
          {/* Title, Channel Name, Views, Date */}
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-white line-clamp-1">
              {video.title}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {video.owner?.username || 'Unknown Channel'}
            </p>
            <p className="text-gray-400 text-sm line-clamp-1">
              {formatViews(video.views || 0)} views • {timeAgo(video.createdAt)}
            </p>
            {/* Description snippet for search page context */}
            {video.description && (
              <p className="text-gray-500 text-xs mt-1 line-clamp-1 ">
                {video.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;
