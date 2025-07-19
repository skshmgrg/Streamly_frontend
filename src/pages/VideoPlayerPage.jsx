import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function VideoPlayerPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [related, setRelated] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const videoRef = useRef(null);
  const [showComments, setShowComments] = useState(false);


  const fetchComments = async (pageNum = 1) => {
    const res = await axiosInstance.get(`/comments/${videoId}?page=${pageNum}`);
    const { comments: newComments, currentPage, totalPages } = res.data.data;
    setComments(prev => (pageNum === 1 ? newComments : [...prev, ...newComments]));
    setHasMoreComments(currentPage < totalPages);
    setPage(currentPage);
  };

  const fetchLikes = async () => {
    const res = await axiosInstance.get(`/likes/video/${videoId}`);
    const likes = res.data.data.likes;
    setLikesCount(likes.length);
    setIsLiked(likes.some(like => like.likedBy === user._id));
  };

  const fetchSubscription = async channelId => {
    const statusRes = await axiosInstance.get(`/subscriptions/status?channelId=${channelId}`);
    setIsSubscribed(statusRes.data.data.subscribed);
    const countRes = await axiosInstance.get(`/subscriptions/count?channelId=${channelId}`);
    setSubscriberCount(countRes.data.data.count);
  };

  useEffect(() => {
    setVideo(null);
    axiosInstance.get(`/videos/${videoId}`)
      .then(res => {
        setVideo(res.data.data);
        fetchSubscription(res.data.data.owner._id);
      })
      .catch(err => console.error('Error fetching video:', err));

    fetchComments(1);
    axiosInstance.get('/videos')
      .then(res => {
        const all = res.data.data.videos;
        setRelated(all.filter(v => v._id !== videoId));
      })
      .catch(err => console.error('Error fetching related videos:', err));

    fetchLikes();
  }, [videoId]);


  const handleLike = async () => {
  try {
    await axiosInstance.post(`/likes/toggle/v/${videoId}`);
    fetchLikes(); // Refresh the like state/count
  } catch (err) {
    console.error("Error toggling like:", err);
  }
};
  const handleShare = () => {
  try {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy:", err);
    alert("Failed to copy link.");
  }
};


  const handleCommentSubmit = async e => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await axiosInstance.post(`/comments/${videoId}`, { commentContent: commentText });
      setCommentText('');
      fetchComments(1);
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

const handleSubscribe = async () => {
  try {
    const res = await axiosInstance.post(`/subscriptions/c/${video.owner._id}`);
    setIsSubscribed(res.data.data.subscribed);  
          // if backend returns updated state
          if(res.data.data.subscribed==1)
          {
            setSubscriberCount(subscriberCount+1);
          }
          else{
            setSubscriberCount(subscriberCount-1);

          }
  } catch (err) {
    console.error('Error toggling subscription:', err);
  }
};

  if (!video) return <div>Loading...</div>;

  return (
  <div className="flex flex-col lg:flex-row p-4 space-y-6 lg:space-y-0 lg:space-x-8" key={videoId}>
    <div className="flex-1">
      <div className="w-full aspect-video bg-black">
        <video
          ref={videoRef}
          key={videoId}
          src={video.videoFile}
          controls
          autoPlay
          muted
          className="w-full h-full object-cover"
        />
      </div>

      <h1 className="mt-4 text-2xl font-semibold text-white">{video.title}</h1>
      <div className="flex items-center text-gray-400 mt-2 space-x-4">
        <span>{video.views} views</span>
        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="mt-6 flex items-center space-x-4">
        <img
          src={video.owner.avatar}
          alt={video.owner.channelName}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="text-white font-semibold">{video.owner.channelName}</p>
          <p className="text-gray-400 text-sm">{subscriberCount} subscribers</p>
        </div>
        <button
          onClick={handleSubscribe}
          className="ml-auto px-4 py-1 bg-red-600 rounded text-white"
        >
          {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
        </button>
      </div>

      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleLike}
          className="px-4 py-2 bg-gray-700 rounded"
        >
          {isLiked ? '👍' : 'Like'} ({likesCount})
        </button>
      
        <button onClick={handleShare} className="px-4 py-2 bg-gray-700 rounded">Share</button>
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded">
        <p className="text-gray-200 whitespace-pre-wrap">{video.description}</p>
      </div>

      {/* Comment Toggle for Mobile */}
      <div className="lg:hidden mt-6">
        <button
          onClick={() => setShowComments(prev => !prev)}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded"
        >
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>

      {/* Comment Section */}
      <div className={`mt-8 ${showComments ? '' : 'hidden'} lg:block`}>
        <h2 className="text-xl font-medium text-white mb-4">Comments</h2>
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Add a public comment..."
            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 rounded text-white"
          >
            Comment
          </button>
        </form>
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c._id} className="flex space-x-3">
              <img
                src={c.owner.avatar}
                alt={c.owner.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-white font-semibold">{c.owner.username}</p>
                <p className="text-gray-300 text-sm">{c.content}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        {hasMoreComments && (
          <button
            onClick={() => fetchComments(page + 1)}
            className="mt-4 px-4 py-2 bg-gray-700 rounded"
          >
            Load more
          </button>
        )}
      </div>
    </div>

    {/* Sidebar (related videos) — stays on right in desktop, below on mobile */}
    {/* Sidebar (related videos) — stays on right in desktop, below on mobile */}
<div className="w-full lg:w-1/3 space-y-4">
  {related.map(v => (
    <div
      key={v._id}
      className="flex cursor-pointer"
      onClick={() => navigate(`/watch/${v._id}`)}
    >
      <img
        src={v.thumbnail}
        alt={v.title}
        className="w-40 h-24 object-cover rounded flex-shrink-0" // Added flex-shrink-0
      />
      <div className="ml-3 flex-grow min-w-0"> {/* Added flex-grow and min-w-0 */}
        <p className="text-white font-semibold line-clamp-2">
          {v.title}
        </p>
        {/* Display Owner Username */}
        <p className="text-gray-400 text-sm truncate"> {/* Added truncate */}
          {v.owner?.username || 'Unknown Channel'}
        </p>
        <p className="text-gray-400 text-sm">
          {v.views} views
        </p>
      </div>
    </div>
  ))}
</div>
  </div>
);

}
