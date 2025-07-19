// src/api/axiosInstance.js --- This file configures Axios to know your backend's base URL and, most importantly, to send cookies with cross-origin requests
import axios from "axios";

// 1. Create a base Axios instance
const axiosInstance = axios.create({
  
  baseURL: import.meta.env.VITE_API_URL, // Your backend API base URl
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn(
        "Unauthorized request detected (401). Possibly expired or invalid token."
      );
    }
    return Promise.reject(error); // Propagate the error so calling functions can catch it
  }
);

export default axiosInstance;
// with credentials :CRITICAL for cookies:
// `withCredentials: true` tells Axios to include cookies (and authorization headers)
// in cross-origin requests. This is essential for your httpOnly cookies to be sent.

// 2. No Request Interceptor needed for JWT in httpOnly cookie!
//    The browser automatically sends the httpOnly cookies with each request
//    to the same origin (or when configured by CORS with `withCredentials`).
//    Your backend's `verifyJwt` middleware will read from `req.cookies.accessToken`.
//    If your backend also supports Authorization: Bearer, you could add an interceptor
//    to send it that way if you also store it in localStorage for some reason,
//    but for your current setup, it's not strictly needed for the access token in cookie.
//    (You might use a request interceptor for other things later, like adding a client ID.)
/*


// --- OLD (LESS RELEVANT FOR YOUR COOKIE SETUP) ---
// axiosInstance.interceptors.request.use(
    //   (config) => {
        //     // This part is NOT needed if your backend primarily reads JWT from httpOnly cookies.
        //     // The browser automatically sends the cookies.
        //     // const token = localStorage.getItem('accessToken');
        //     // if (token) {
            //     //   config.headers.Authorization = `Bearer ${token}`;
            //     // }
            //     return config;
            //   },
            //   (error) => {
                //     return Promise.reject(error);
                //   }
                // );
                // --- END OLD ---
                */

// 3. (Optional but Recommended) Add a Response Interceptor for Global Error Handling
//    This is useful for automatically handling 401s (Unauthorized) by logging out the user.
// Check if the error has a response from the server and it's a 401

// IMPORTANT: You'll want to trigger a logout here.
// We can't directly call logout() from AuthContext here,
// as this is a standalone utility. The AuthContext's checkAuth
// will handle cleaning up, or you can use a global event.
// For now, let's just log and let AuthContext handle it.
// Alternatively, you could emit an event that AuthContext listens to.
