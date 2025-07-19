// src/components/Header.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { Link, useNavigate } from 'react-router-dom'; 
import streamlyLogo from '../assets/streamly_logo_3.png';

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth(); 
  const navigate = useNavigate();

  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isSearchMobileOpen, setIsSearchMobileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
    if (isSearchMobileOpen) setIsSearchMobileOpen(false);
  };
  const handleMobileSearchToggle = () => {
    setIsSearchMobileOpen(!isSearchMobileOpen);
    if (isNavbarOpen) setIsNavbarOpen(false);
  };
  const handleLogout = () => {
    logout();
    setIsNavbarOpen(false);
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) return;
    navigate(`/?query=${encodeURIComponent(q)}`);
    setSearchInput("");
    setIsSearchMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src={streamlyLogo}
            alt="Streamly Logo"
            className="h-8 w-8"
          />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            Streamly
          </span>
        </Link>

        {/* Right side: search + auth + hamburger */}
        <div className="flex items-center space-x-3 md:order-2">

          {/* Mobile Search Toggle */}
          <button
            onClick={handleMobileSearchToggle}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none"
          >
            🔍
          </button>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center"
          >
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search videos..."
                className="pl-4 pr-10 py-2 w-64 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Go
              </button>
            </div>
          </form>

          {/* Desktop Auth Links */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <Link
                  to="/upload"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                >
                  Upload
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  <span>👤</span>
                  <span className="text-gray-900 dark:text-white">
                    {user?.username || 'Profile'}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleNavbar}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Search Input (always toggled by 🔍) */}
      {isSearchMobileOpen && (
        <div className="w-full md:hidden px-4 pb-3">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search videos..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </form>
        </div>
      )}

      {/* Mobile Nav Links */}
      <div className={`${isNavbarOpen ? 'block' : 'hidden'} w-full md:hidden px-4 pb-4`}>
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              onClick={() => setIsNavbarOpen(false)}
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              onClick={() => setIsNavbarOpen(false)}
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              My Profile
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link
                  to="/upload"
                  onClick={() => setIsNavbarOpen(false)}
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Upload
                </Link>
              </li>
              <li>
                <Link
                  to="/channel"
                  onClick={() => setIsNavbarOpen(false)}
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Channel Stats
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  onClick={() => setIsNavbarOpen(false)}
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  onClick={() => setIsNavbarOpen(false)}
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}
