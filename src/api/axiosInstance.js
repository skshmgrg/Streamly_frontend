//A custom Axios instance is made to set common configurations once (like baseURL, headers, cookies, or interceptors) so we don’t have to repeat them in every request.
import axios from "axios";

// Create our own Axios version with custom defaults
const axiosInstance = axios.create({
  
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

//Handle common errors (like 401 Unauthorized) globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn(
        "Unauthorized request detected (401). Possibly expired or invalid token."
      );
    }
    return Promise.reject(error); //promise.reject invokes the catch part , response.then X , response.catch 
  }
);

export default axiosInstance;
