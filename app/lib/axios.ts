import axios from 'axios';
import authService from '../services/authService';

// Create axios instance with default config
const baseURL = import.meta.env.VITE_API_URL || 'https://elthoura.tryasp.net/api/v1';

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

    // Skip token refresh for auth endpoints
    const isAuthEndpoint = config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/register') ||
      config.url?.includes('/auth/refresh-token');

    if (token && !isAuthEndpoint) {
      // Check if token is expired or expiring soon (within 60 seconds)
      const isExpired = authService.isTokenExpired(60);

      if (isExpired) {


        // Wait if refresh is already in progress
        if (isRefreshing) {

          await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
        } else {
          // Trigger refresh
          isRefreshing = true;

          try {
            const refreshToken = authService.getRefreshToken();

            if (!refreshToken) {

              throw new Error('No refresh token available');
            }


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


            // Update tokens in cookies
            authService.setTokens(accessToken, newRefreshToken, expiresAt);

            // Update authorization header
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            config.headers.Authorization = `Bearer ${accessToken}`;

            // Process queued requests
            processQueue(null, accessToken);
          } catch (error) {

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

    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh and capture ETags
axiosInstance.interceptors.response.use(
  (response) => {


    // Extract and log ETag if present
    const etag = response.headers['etag'];
    if (etag) {

      // Attach ETag to response config for cache to access (using type assertion)
      (response.config as any).etag = etag;
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;


    // Don't attempt refresh for login/register/refresh-token endpoints
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh-token');



    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {

      if (isRefreshing) {

        // Queue the request while token is being refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {

            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {

            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {

        const refreshToken = authService.getRefreshToken();

        if (!refreshToken) {

          throw new Error('No refresh token available');
        }


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


        // Update tokens in cookies with expiry
        authService.setTokens(accessToken, newRefreshToken, expiresAt);

        // Update authorization header
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process queued requests

        processQueue(null, accessToken);

        // Retry original request

        return axiosInstance(originalRequest);
      } catch (refreshError) {

        // Refresh failed - clear all tokens and redirect to login
        authService.logout();

        if (typeof window !== 'undefined') {

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

          break;
        case 404:
          // Not found

          break;
        case 500:
          // Server error

          break;
        default:
          if (status !== 401) {

          }
      }
    } else if (error.request) {
      // Request made but no response received

    } else {
      // Something else happened

    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
