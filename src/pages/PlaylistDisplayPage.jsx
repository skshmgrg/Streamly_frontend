import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import VideoCard from "../components/VideoCard";

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage] = useState(6);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", description: "" });
  const [videoIdInput, setVideoIdInput] = useState("");


  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);

  const fetchPlaylist = async () => {
    try {
      const { data } = await axiosInstance.get(`/playlist/${playlistId}`);
      setPlaylist(data.data);
      setEditData({
        name: data.data.name,
        description: data.data.description,
      });
    } catch (err) {
      console.error("Error fetching playlist", err);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      await axiosInstance.patch(`/playlist/remove/${videoId}/${playlistId}`);
      fetchPlaylist();
    } catch (err) {
      console.error("Failed to remove video", err);
    }
  };

  const handleAddVideo = async () => {
    if (!videoIdInput.trim()) return;
    try {
      await axiosInstance.patch(`/playlist/add/${videoIdInput}/${playlistId}`);
      setVideoIdInput("");
      fetchPlaylist();
    } catch (err) {
      console.error("Error adding video", err);
    }
  };

  const handleUpdatePlaylist = async () => {
    try {
      await axiosInstance.patch(`/playlist/${playlistId}`, editData);
      setEditing(false);
      fetchPlaylist();
    } catch (err) {
      console.error("Error updating playlist", err);
    }
  };

  const paginatedVideos = playlist?.videos?.slice(
    (currentPage - 1) * videosPerPage,
    currentPage * videosPerPage
  );

  return (
    <div className="p-6 text-white min-h-screen bg-[#111827] relative pb-24">
      {playlist ? (
        <>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              {editing ? (
                <>
                  <input
                    className="bg-gray-800 text-white p-2 rounded mb-2 block"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />
                  <textarea
                    className="bg-gray-800 text-white p-2 rounded mb-2 block"
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                  />
                  <button
                    onClick={handleUpdatePlaylist}
                    className="bg-blue-600 px-4 py-1 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-gray-600 px-4 py-1 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold">{playlist.name}</h2>
                  <p className="text-gray-400">{playlist.description}</p>
                </>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center bg-gray-800 rounded px-2">
                <input
                  type="text"
                  placeholder="Enter Video ID"
                  className="bg-transparent text-white px-2 py-1 outline-none"
                  value={videoIdInput}
                  onChange={(e) => setVideoIdInput(e.target.value)}
                />
                <button
                  onClick={handleAddVideo}
                  className="bg-green-600 px-3 py-1 rounded ml-2"
                >
                  Add
                </button>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="bg-yellow-500 px-4 py-1 rounded"
              >
                Edit Playlist
              </button>
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
  {paginatedVideos.map((video) => (
    <div
  key={video._id}
  className="relative bg-zinc-800 rounded-xl shadow hover:shadow-md transition"
>
  <VideoCard video={video} />

  {/* Trash Icon - Bottom Right */}
  <button
    onClick={() => handleDeleteVideo(video._id)}
    className="absolute bottom-3 right-3 z-10 text-red-400 hover:text-red-600 p-2 rounded-full bg-zinc-900 bg-opacity-80 hover:bg-opacity-100 transition"
    title="Delete"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7L5 7M6 7V19a2 2 0 002 2h8a2 2 0 002-2V7M10 11v6M14 11v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
    </svg>
  </button>
</div>

  ))}
</div>



          {/* Pagination Fixed Bottom */}
          <div className="fixed bottom-0 left-0 w-full bg-[#111827] border-t border-gray-700 py-4 px-6 flex justify-center gap-6 z-50">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="bg-gray-700 px-3 py-1 rounded"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-300 self-center">Page {currentPage}</span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev * videosPerPage < playlist.videos.length ? prev + 1 : prev
                )
              }
              className="bg-gray-700 px-3 py-1 rounded"
              disabled={currentPage * videosPerPage >= playlist.videos.length}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-400">Loading playlist...</p>
      )}
    </div>
  );
};

export default PlaylistDetails;
