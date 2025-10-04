
import axios from "axios";

const axiosInstance = axios.create({
  
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

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
    return Promise.reject(error); 
  }
);

export default axiosInstance;
