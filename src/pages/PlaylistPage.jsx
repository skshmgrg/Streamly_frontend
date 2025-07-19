// pages/MyPlaylistsPage.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const MyPlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchUserPlaylists();
  }, []);

  const fetchUserPlaylists = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/playlist/user`);
      setPlaylists(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch playlists.");
      console.error("Error fetching playlists:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim() || !newPlaylistDescription.trim()) {
      alert("Playlist name and description cannot be empty.");
      return;
    }
    try {
      const response = await axiosInstance.post('/playlist/', {
        name: newPlaylistName.trim(),
        description: newPlaylistDescription.trim(),
      });
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      fetchUserPlaylists();
      alert(response.data.message);
      setShowCreateForm(false); // Collapse form after successful creation
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create playlist.");
      console.error("Error creating playlist:", err);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (window.confirm("Are you sure you want to delete this playlist? This action cannot be undone.")) {
      try {
        await axiosInstance.delete(`/playlist/${playlistId}`);
        fetchUserPlaylists();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete playlist.");
        console.error("Error deleting playlist:", err);
      }
    }
  };

  const getPlaylistThumbnail = (playlist) => {
    if (playlist.videos && playlist.videos.length > 0) {
      return playlist.videos[0].thumbnail || 'https://via.placeholder.com/280x160?text=No+Thumbnail';
    }
    return 'https://via.placeholder.com/280x160?text=Empty+Playlist';
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-[#1A1A2E] text-gray-200 flex items-center justify-center">
        Loading playlists...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 bg-[#1A1A2E] text-red-400 text-center text-lg mt-10">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-[#1A1A2E] text-gray-200 min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-8">My Playlists</h1>

      {/* Create Playlist Section (Collapsible) */}
      <div className="bg-[#21213F] p-6 rounded-lg shadow-xl mb-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white mb-3">Create New Playlist</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="text-sm text-blue-400 hover:text-blue-300 underline focus:outline-none"
          >
            {showCreateForm ? "Hide" : "Create"}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreatePlaylist} className="flex flex-col space-y-4 mt-4">
            <input
              type="text"
              placeholder="Enter playlist name..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              required
              className="p-3 border border-gray-600 rounded-md bg-[#2C2C4D] text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Describe your playlist..."
              value={newPlaylistDescription}
              onChange={(e) => setNewPlaylistDescription(e.target.value)}
              rows="3"
              className="p-3 border border-gray-600 rounded-md bg-[#2C2C4D] text-gray-100 placeholder-gray-400 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-200 self-start"
            >
              Create Playlist
            </button>
          </form>
        )}
      </div>

      {/* Playlists Display Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {playlists.length === 0 ? (
          <p className="text-gray-400 text-lg col-span-full text-center py-10">
            You haven't created any playlists yet.
          </p>
        ) : (
          playlists.map((playlist) => (
            <div key={playlist._id} className="bg-[#21213F] rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 flex flex-col">
              <a href={`/playlist/${playlist._id}`} className="relative block group">
                <img
                  src={getPlaylistThumbnail(playlist)}
                  alt={playlist.name}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                {playlist.videos && playlist.videos.length > 0 && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                    {playlist.videos.length} Videos
                  </div>
                )}
              </a>
              <div className="p-4 flex flex-col flex-grow">
                <a href={`/playlist/${playlist._id}`} className="text-lg font-semibold text-white hover:text-blue-400 transition duration-200 mb-2 line-clamp-1">
                  {playlist.name}
                </a>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2 flex-grow">
                  {playlist.description}
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Created by You &bull; {new Date(playlist.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </p>
                <div className="flex justify-end space-x-3 mt-auto">
                  {/* Edit button */}
                  
                  {/* Delete button */}
                  <button
                    onClick={() => handleDeletePlaylist(playlist._id)}
                    className="text-gray-400 hover:text-red-500 transition duration-200 p-1 rounded-full hover:bg-gray-700"
                    title="Delete Playlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {/* Share button */}
                  
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyPlaylistsPage;
