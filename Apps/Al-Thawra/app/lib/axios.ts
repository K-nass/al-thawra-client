import axios from 'axios';

// Create axios instance with default config
const baseURL = import.meta.env.VITE_API_URL || 'https://new-cms-dev.runasp.net/api/v1';
console.log('API Base URL:', baseURL);

const axiosInstance = axios.create({
  baseURL,
  timeout: 30000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Get token from localStorage
//     const token = localStorage.getItem('authToken'); //TODO: change!
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login (only in browser)
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden:', data?.message || 'Forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found:', data?.message || 'Not found');
          break;
        case 500:
          // Server error
          console.error('Server error:', data?.message || 'Internal server error');
          break;
        default:
          console.error('API error:', data?.message || 'Unknown error');
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
