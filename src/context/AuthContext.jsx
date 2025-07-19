// src/context/AuthContext.jsx
//this is the file where we make the context , like we did messagecontext in a separate file in our prev project

import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance'; 

const AuthContext = createContext(null);//null initial value given to AuthContext

// A custom hook in React is a JavaScript function that starts with the word use and allows you to reuse logic involving hooks like useState, useEffect, or useContext across multiple components.
//we want to provide Authcontext values globally , for that , we have to do usecontext(Authcontext).value_needed; so to avoid typing this everytime , we have replaced usecontext(Authcontext) with useAUTH . THIS USEaUTH IS A CUSTOM HOOK

export const useAuth = () => {
  return useContext(AuthContext);
};


//the App component will be consisting of children here

export const AuthProvider = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 const checkAuth = async () => {
    setLoading(true); 
    try {
    
      const response = await axiosInstance.get('/users/current-user');

      if (response.status === 200) {
        
        setIsLoggedIn(true);
        setUser(response.data.data);
        console.log("User is authenticated:", response.data.data.username);
      } else {

        setIsLoggedIn(false);
        setUser(null);

        console.log("Authentication failed with status:", response.status);
      }
    } catch (error) {
     
      console.error("Initial authentication check failed:", error);
      setIsLoggedIn(false);
      setUser(null);

      if (error.response) {
    
        console.error("Error Response Status:", error.response.status);
        console.error("Error Response Data:", error.response.data);
        if (error.response.status === 401) {
            console.log("User not authorized (401). Please log in.");
        }
      } else if (error.request) {

        console.error("No response received from server:", error.request);
      } else {
    
        console.error("Error setting up the request:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };



  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post('/users/login', credentials);

      if (response.status === 200) {
        const userData = response.data.data.user;

        setIsLoggedIn(true);
        setUser(userData);
        console.log("Login successful! Cookies should be set.");
        return true; 
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response) {
        console.error("Login Error Status:", error.response.status);
        console.error("Login Error Data:", error.response.data);
      }
      return false; 
    }
  };

  const logout = async () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (!confirmLogout) return;

  try {
    await axiosInstance.post('/users/logout');

    setIsLoggedIn(false);
    setUser(null);
    console.log("Logged out successfully.");
  } catch (error) {
    console.error("Logout failed:", error);
    setIsLoggedIn(false);
    setUser(null);
  }
};


  useEffect(() => {
    checkAuth();
  }, []);

  const authContextValue = {
    isLoggedIn,
    user,
    loading, 
    login,
    logout,
    checkAuth 
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children} 
      {loading && <div>Loading authentication...</div>}
    </AuthContext.Provider>
  );
};