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
const setCookie = (name: string, value: string, expiresAt?: string) => {
  if (typeof document === 'undefined') return;
  
  let expires = '';
  if (expiresAt) {
    const expiryDate = new Date(expiresAt);
    expires = `; expires=${expiryDate.toUTCString()}`;
  }
  
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`;
};

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

const removeCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
};

class AuthService {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
      
      console.log('Login response:', response);
      console.log('Response data:', response.data);
      
      // Store tokens in cookies with expiry date
      if (response.data.accessToken && response.data.refreshToken) {
        setCookie('accessToken', response.data.accessToken, response.data.expiresAt);
        setCookie('refreshToken', response.data.refreshToken, response.data.expiresAt);
        setCookie('user', JSON.stringify(response.data.user), response.data.expiresAt);
        console.log('✅ Tokens stored in cookies with expiry:', response.data.expiresAt);
      } else {
        console.warn('Missing accessToken or refreshToken in response');
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
      
      console.log('Register response:', response);
      console.log('Response data:', response.data);
      
      // Store tokens in cookies with expiry date
      if (response.data.accessToken && response.data.refreshToken) {
        setCookie('accessToken', response.data.accessToken, response.data.expiresAt);
        setCookie('refreshToken', response.data.refreshToken, response.data.expiresAt);
        setCookie('user', JSON.stringify(response.data.user), response.data.expiresAt);
        console.log('✅ Tokens stored in cookies with expiry:', response.data.expiresAt);
      } else {
        console.warn('Missing accessToken or refreshToken in response');
      }
      
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  // Logout
  logout(): void {
    removeCookie('accessToken');
    removeCookie('refreshToken');
    removeCookie('user');
    console.log('✅ Tokens cleared from cookies');
  }

  // Get current user from cookies
  getCurrentUser() {
    const userStr = getCookie('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Failed to parse user from cookie:', e);
        return null;
      }
    }
    return null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!getCookie('accessToken');
  }

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
    console.log('✅ Tokens updated in cookies');
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
