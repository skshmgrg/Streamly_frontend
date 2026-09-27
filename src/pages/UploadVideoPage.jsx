import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function VideoUploadPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState(''); // 'uploading' | 'processing' | 'done' | 'failed'

  const handleFileChange = (e) => {
  const selected = e.target.files[0];
  if (!selected) {
    setFile(null); // Clear file
    return;
  }

  // Check file type
  if (!selected.type.startsWith('video/')) {
    setError('Please select a valid video file.');
    setFile(null); // Clear previous valid file
    return;
  }

  // Check file size (100MB max)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (selected.size > maxSize) {
    setError('Video file must be less than 100MB.');
    setFile(null); // Clear previous valid file
    return;
  }

  // Valid file
  setError('');
  setFile(selected);
};



  const handleThumbnailChange = e => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith('image/')) {
      setError('Please select an image file for thumbnail.');
      return;
    }
    setError('');
    setThumbnail(selected);
  };

  const pollVideoStatus = (videoId) => {
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        try {
          const res = await axiosInstance.get(`/videos/${videoId}`);
          const status = res.data?.data?.status;
          if (status === 'ready') {
            clearInterval(interval);
            resolve('ready');
          } else if (status === 'failed') {
            clearInterval(interval);
            resolve('failed');
          }
          // else keep polling
        } catch {
          // keep polling even on transient errors
        }
      }, 3000);
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) {
    setError('Please upload a valid video file under 100MB.');
    return;
  }
    if (!title || !description || !thumbnail) {
      setError('All fields are required.');
      return;
    }
    //input taken in states and then object formed manually 
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('videoFile', file);
    formData.append('thumbnail', thumbnail);
    formData.append('owner', user._id);

    try {
      setUploading(true);
      setProcessingStatus('uploading');
      const res = await axiosInstance.post('/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const videoId = res.data?.data?.videoId;
      if (!videoId) {
        throw new Error('Video processing ID was not returned');
      }

      setProcessingStatus('processing');
      const finalStatus = await pollVideoStatus(videoId);

      if (finalStatus === 'failed') {
        setProcessingStatus('failed');
        setError('Video processing failed on the server. Please try uploading again.');
        setUploading(false);
        return;
      }

      setProcessingStatus('done');
      navigate(`/watch/${videoId}`);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload. Please try again.');
      setProcessingStatus('');
    } finally {
      if (processingStatus !== 'processing') {
        setUploading(false);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-gray-900 text-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Upload Video</h2>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 bg-gray-800 rounded"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter video title"
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full p-2 bg-gray-800 rounded h-24"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter video description"
          />
        </div>
        <div>
          <label className="block mb-1">{'Video File (Size < 100 MB)'}</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="w-full text-gray-400"
          />
        </div>
        <div>
          <label className="block mb-1">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="w-full text-gray-400"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-2 mt-4 bg-blue-600 rounded text-white ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {processingStatus === 'uploading' && 'Uploading...'}
          {processingStatus === 'processing' && 'Processing video...'}
          {processingStatus === 'done' && 'Almost done!'}
          {!processingStatus && 'Upload Video'}
        </button>
        {processingStatus === 'processing' && (
          <p className="mt-3 text-yellow-400 text-sm text-center animate-pulse">
            ⏳ Your video is being processed. Please wait, this may take a minute...
          </p>
        )}
      </form>
    </div>
  );
}
