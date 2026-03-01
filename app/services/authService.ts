import axiosInstance from '../lib/axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordData {
  token: string;
  userId: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt?: string;
  user: {
    id: string;
    username: string;
    email: string;
    avatarImageUrl?: string;
    isActive?: boolean;
    emailConfirmed?: boolean;
    createdAt?: string;
    role: string;
    permissions?: string[];
    hasAllPermissions?: boolean;
  };
}

// Cookie utility functions
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
};

const setCookie = (name: string, value: string, expiresAt?: string) => {
  if (typeof document === 'undefined') {
    return;
  }

  let expires = '';
  if (expiresAt) {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    // Check if the expiry date is in the past
    if (expiryDate <= now) {
      // Set expiry to 7 days from now
      const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      expires = `; expires=${futureDate.toUTCString()}`;
    } else {
      expires = `; expires=${expiryDate.toUTCString()}`;
    }
  } else {
    // If no expiry provided, set to 7 days
    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    expires = `; expires=${futureDate.toUTCString()}`;
  }

  const cookieString = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`;

  document.cookie = cookieString;

  // Verify cookie was set
  setTimeout(() => {
    const verification = getCookie(name);
  }, 10);
};

// Store expiry date separately for easy access
const setExpiryDate = (expiresAt: string) => {
  if (typeof document === 'undefined') return;
  setCookie('tokenExpiresAt', expiresAt, expiresAt);
};

const getExpiryDate = (): string | null => {
  return getCookie('tokenExpiresAt');
};

const removeCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
};

class AuthService {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);

      // Store tokens in cookies with expiry date
      if (response.data.accessToken && response.data.refreshToken) {
        setCookie('accessToken', response.data.accessToken, response.data.expiresAt);
        setCookie('refreshToken', response.data.refreshToken, response.data.expiresAt);
        setCookie('user', JSON.stringify(response.data.user), response.data.expiresAt);
        if (response.data.expiresAt) {
          setExpiryDate(response.data.expiresAt);
        }


        // Debug: Show all cookies after setting

      } else {

      }

      return response.data;
    } catch (error) {

      throw error;
    }
  }

  // Register
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/register', data);

      // Store tokens in cookies with expiry date
      if (response.data.accessToken && response.data.refreshToken) {
        setCookie('accessToken', response.data.accessToken, response.data.expiresAt);
        setCookie('refreshToken', response.data.refreshToken, response.data.expiresAt);
        setCookie('user', JSON.stringify(response.data.user), response.data.expiresAt);
        if (response.data.expiresAt) {
          setExpiryDate(response.data.expiresAt);
        }

      } else {

      }

      return response.data;
    } catch (error) {

      throw error;
    }
  }

  // Logout
  logout(): void {
    removeCookie('accessToken');
    removeCookie('refreshToken');
    removeCookie('user');
    removeCookie('tokenExpiresAt');

  }

  // Get current user from cookies
  getCurrentUser() {
    const userStr = getCookie('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {

        return null;
      }
    }
    return null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const hasToken = !!getCookie('accessToken');

    return hasToken;
  }

  // Debug: List all auth cookies

  // Get token from cookies
  getToken(): string | null {
    return getCookie('accessToken');
  }

  // Get refresh token from cookies
  getRefreshToken(): string | null {
    return getCookie('refreshToken');
  }

  // Set tokens in cookies (used by axios interceptor)
  setTokens(accessToken: string, refreshToken: string, expiresAt?: string): void {
    setCookie('accessToken', accessToken, expiresAt);
    setCookie('refreshToken', refreshToken, expiresAt);
    if (expiresAt) {
      setExpiryDate(expiresAt);
    }

  }

  // Get token expiry date
  getTokenExpiryDate(): Date | null {
    const expiryStr = getExpiryDate();
    if (!expiryStr) return null;

    try {
      return new Date(expiryStr);
    } catch (e) {

      return null;
    }
  }

  // Check if token is expired or will expire soon (within buffer seconds)
  isTokenExpired(bufferSeconds: number = 60): boolean {
    const expiryDate = this.getTokenExpiryDate();
    if (!expiryDate) {
      // No expiry date means we should check with the server
      return false;
    }

    const now = new Date();
    const bufferMs = bufferSeconds * 1000;
    const expiryWithBuffer = new Date(expiryDate.getTime() - bufferMs);

    const isExpired = now >= expiryWithBuffer;

    return isExpired;
  }

  // Forgot password - send reset link
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await axiosInstance.post<{ message: string }>('/auth/forgot-password', { email });
    return response.data;
  }

  // Reset password
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await axiosInstance.post<{ message: string }>('/auth/reset-password', data);
    return response.data;
  }
}

export default new AuthService();
