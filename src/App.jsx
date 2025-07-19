// src/App.jsx
import React from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext'; 
import Header from './components/Header';
import ChannelStatsPage from './pages/ChannelPage';
import Sidebar from './components/Sidebar'; 
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UserProfile from './pages/UserProfilePage';
import UploadVideoPage from './pages/UploadVideoPage';
import SignupPage from './pages/SignupPage';
import PlaylistPage from './pages/PlaylistPage';
import PlaylistDetails from './pages/PlaylistDisplayPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import WatchHistoryPage from './pages/WatchHistoryPage';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                <p>Loading application...</p>
            </div>
        );
    }
    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// AppContent component holds the main layout and routing
const AppContent = () => {

    return (
        
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-4 md:p-8"> 
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
    
                        <Route
                            path="/channel"
                            element={
                                <PrivateRoute>
                                    <ChannelStatsPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/users/watchHistory"
                            element={
                                <PrivateRoute>
                                    <WatchHistoryPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/upload"
                            element={
                                <PrivateRoute>
                                    <UploadVideoPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/playlists"
                            element={
                                <PrivateRoute>
                                    <PlaylistPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/playlist/:playlistId"
                            element={
                                <PrivateRoute>
                                    <PlaylistDetails />
                                </PrivateRoute>
                            }
                        />
                        
                        <Route
                            path="/watch/:videoId"
                            element={
                                <PrivateRoute>
                                    <VideoPlayerPage/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <UserProfile />
                                </PrivateRoute>
                            }
                        />
                        
                    </Routes>
                </main>
            </div>
        </div>
    );
};

function App() {
    return (
        <Router>
          <AppContent />
        </Router>
    );
}

export default App;