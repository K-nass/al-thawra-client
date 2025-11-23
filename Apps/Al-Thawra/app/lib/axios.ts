import axios from 'axios';
import authService from '../services/authService';

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

// Token refresh state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token || '');
    }
  });
  
  isRefreshing = false;
  failedQueue = [];
};

// Request interceptor - Add token to headers and check expiry
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get token from cookies
    const token = authService.getToken();
    
    console.log('📤 Request:', config.method?.toUpperCase(), config.url, 'Token:', token ? 'Present' : 'Missing');
    
    // Skip token refresh for auth endpoints
    const isAuthEndpoint = config.url?.includes('/auth/login') || 
                          config.url?.includes('/auth/register') ||
                          config.url?.includes('/auth/refresh-token');
    
    if (token && !isAuthEndpoint) {
      // Check if token is expired or expiring soon (within 60 seconds)
      const isExpired = authService.isTokenExpired(60);
      
      if (isExpired) {
        console.log('🔄 Token expiring soon, refreshing proactively...');
        
        // Wait if refresh is already in progress
        if (isRefreshing) {
          console.log('⏳ Refresh in progress, waiting...');
          await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
        } else {
          // Trigger refresh
          isRefreshing = true;
          
          try {
            const refreshToken = authService.getRefreshToken();
            
            if (!refreshToken) {
              console.error('❌ No refresh token available');
              throw new Error('No refresh token available');
            }
            
            console.log('📡 Refreshing token proactively...');
            const response = await axios.post(
              `${baseURL}/auth/refresh-token`,
              { refreshToken },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
            
            const { accessToken, refreshToken: newRefreshToken, expiresAt } = response.data;
            console.log('✅ Token refreshed proactively');
            
            // Update tokens in cookies
            authService.setTokens(accessToken, newRefreshToken, expiresAt);
            
            // Update authorization header
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            config.headers.Authorization = `Bearer ${accessToken}`;
            
            // Process queued requests
            processQueue(null, accessToken);
          } catch (error) {
            console.error('❌ Proactive token refresh failed:', error);
            // Clear tokens and redirect to login
            authService.logout();
            
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            
            processQueue(error, null);
            throw error;
          }
        }
      }
      
      // Add token to headers
      config.headers.Authorization = `Bearer ${authService.getToken()}`;
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh and capture ETags
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.config.method?.toUpperCase(), response.config.url, 'Status:', response.status);
    
    // Extract and log ETag if present
    const etag = response.headers['etag'];
    if (etag) {
      console.log(`🏷️ ETag received: ${etag.substring(0, 30)}...`);
      // Attach ETag to response config for cache to access (using type assertion)
      (response.config as any).etag = etag;
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log('📥 Error response:', error.response?.status, originalRequest.url, 'Retry:', originalRequest._retry);

    // Don't attempt refresh for login/register/refresh-token endpoints
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                          originalRequest.url?.includes('/auth/register') ||
                          originalRequest.url?.includes('/auth/refresh-token');

    console.log('🔍 Is auth endpoint:', isAuthEndpoint, 'Status:', error.response?.status);

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      console.log('🔄 Attempting token refresh...');
      if (isRefreshing) {
        console.log('⏳ Token refresh in progress, queuing request...');
        // Queue the request while token is being refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            console.log('🔄 Retrying queued request with new token');
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            console.error('❌ Queued request failed:', err);
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('🔐 Getting refresh token...');
        const refreshToken = authService.getRefreshToken();
        
        if (!refreshToken) {
          console.error('❌ No refresh token available');
          throw new Error('No refresh token available');
        }

        console.log('📡 Calling refresh token endpoint...');
        // Call refresh token endpoint
        const response = await axios.post(
          `${baseURL}/auth/refresh-token`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const { accessToken, refreshToken: newRefreshToken, expiresAt } = response.data;
        console.log('✅ Token refreshed successfully');

        // Update tokens in cookies with expiry
        authService.setTokens(accessToken, newRefreshToken, expiresAt);

        // Update authorization header
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process queued requests
        console.log('📤 Processing queued requests...');
        processQueue(null, accessToken);

        // Retry original request
        console.log('🔄 Retrying original request with new token');
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        // Refresh failed - clear all tokens and redirect to login
        authService.logout();
        
        if (typeof window !== 'undefined') {
          console.log('🚀 Redirecting to login...');
          window.location.href = '/login';
        }

        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
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
          if (status !== 401) {
            console.error('API error:', data?.message || 'Unknown error');
          }
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
