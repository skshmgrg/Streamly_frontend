import { useEffect, useState, useRef } from "react";
import axiosInstance from "../api/axiosInstance";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "" });
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });
  const avatarInput = useRef(null);
  const coverInput = useRef(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const { data } = await axiosInstance.get('/users/current-user');
      setUser(data.data);
      setFormData({ fullName: data.data.fullName, email: data.data.email });
    } catch (err) {
      console.error("Error fetching current user:", err);
      // Handle error, e.g., redirect to login or show an error message
    }
  };

  const handleAccountUpdate = async () => {
    try {
      const { data } = await axiosInstance.patch('/users/update-account', formData);
      setUser(data.data);
      setEditMode(false);
      alert('Account updated successfully!');
    } catch (err) {
      console.error("Error updating account:", err);
      alert('Failed to update account. Please try again.');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long.');
      return;
    }
    try {
      await axiosInstance.post('/users/change-password', passwordData);
      setPasswordData({ oldPassword: '', newPassword: '' });
      setShowPasswordForm(false);
      alert('Password changed successfully!');
    } catch (err) {
      console.error("Error changing password:", err);
      alert('Failed to change password. Please check your old password and try again.');
    }
  };

  const handleFileUpload = async (type) => {
    const fileInput = type === 'avatar' ? avatarInput : coverInput;
    const file = fileInput.current.files[0];

    if (!file) {
      alert(`Please select a file for ${type}.`);
      return;
    }

    const form = new FormData();
    form.append(type === 'cover' ? 'coverImage' : 'avatar', file);

    try {
      const { data } = await axiosInstance.patch(`/users/${type === 'cover' ? 'cover-image' : 'avatar'}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(data.data);
      alert(`${type === 'cover' ? 'Cover image' : 'Avatar'} updated successfully!`);
    } catch (err) {
      console.error(`Error uploading ${type}:`, err);
      alert(`Failed to upload ${type}. Please try again.`);
    }
  };

  if (!user) {
    return <p className="text-gray-400 p-6">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-[#111827] text-white p-6">
      {/* Cover Image Section */}
      <div className="relative h-48 w-full bg-gray-800 rounded-lg overflow-hidden">
        {user.coverImage && (
          <img
            src={user.coverImage}
            alt="Cover"
            className="object-cover w-full h-full"
          />
        )}
        <div className="absolute top-2 right-2 z-10">
          <input
            ref={coverInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={() => handleFileUpload('cover')}
          />
          <button
            onClick={() => coverInput.current.click()}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
          >
            Change Cover
          </button>
        </div>
      </div>

      {/* Avatar and Basic Info - Adjusted to be below the cover image */}
      <div className="flex flex-col md:flex-row items-center md:items-end mt-[-1rem] relative z-20 md:ml-6"> {/* Changed mt-[-3rem] to mt-8 */}
        <div className="relative mb-4 md:mb-0">
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-4 border-[#111827] object-cover shadow-lg"
          />
          <input
            ref={avatarInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={() => handleFileUpload('avatar')}
          />
          <button
            onClick={() => avatarInput.current.click()}
            className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 p-1 rounded-full text-white text-xs transition-colors duration-200"
            aria-label="Edit avatar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.828z" />
            </svg>
          </button>
        </div>

        <div className="ml-0 md:ml-6 flex-1 text-center md:text-left">
          {!editMode ? (
            <>
              <h2 className="text-3xl font-bold mt-2 md:mt-0">{user.fullName}</h2>
              <p className="text-gray-400 text-lg">@{user.username}</p>
              <p className="mt-1 text-md">{user.email}</p>
            </>
          ) : (
            <div className="space-y-3 max-w-sm mx-auto md:mx-0">
              <input
                className="bg-gray-800 p-3 rounded w-full border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Full Name"
                aria-label="Full Name"
              />
              <input
                className="bg-gray-800 p-3 rounded w-full border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                aria-label="Email"
              />
            </div>
          )}
        </div>

        <div className="mt-6 md:mt-0 ml-auto">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-yellow-600 hover:bg-yellow-500 text-black px-5 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAccountUpdate}
                className="bg-green-700 hover:bg-green-600 px-5 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setFormData({ fullName: user.fullName, email: user.email }); // Revert changes
                }}
                className="bg-gray-600 hover:bg-gray-500 px-5 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Section Toggle */}
      <div className="mt-12 max-w-lg mx-auto md:mx-0">
        <button
          onClick={() => setShowPasswordForm(prev => !prev)}
          className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md"
        >
          {showPasswordForm ? 'Hide Password Form' : 'Change Password'}
        </button>

        {showPasswordForm && (
          <div className="mt-6 bg-zinc-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-5">Update Password</h3>
            <div className="flex flex-col space-y-4">
              <input
                type="password"
                placeholder="Old Password"
                className="bg-gray-800 p-3 rounded border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                aria-label="Old Password"
              />
              <input
                type="password"
                placeholder="New Password"
                className="bg-gray-800 p-3 rounded border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                aria-label="New Password"
              />
              <button
                onClick={handlePasswordChange}
                className="bg-green-700 hover:bg-green-600 px-5 py-2 rounded-lg font-semibold w-max transition-colors duration-200 shadow-md"
              >
                Update Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}