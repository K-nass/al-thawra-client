import { redirect } from "react-router";
import authService from "~/services/authService";

/**
 * Protected route utility for server-side and client-side authentication check
 * Use this in loader functions to protect routes
 */
export function requireAuth(request: Request, allowedRoles?: string[]) {
  // Check if running on server (SSR)
  if (typeof document === 'undefined') {
    // On server, check cookies from request headers
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) {
      throw redirect('/login');
    }
    
    // Parse cookies to check for accessToken
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {} as Record<string, string>);
    
    if (!cookies.accessToken) {
      throw redirect('/login');
    }
    
    // Check role if allowedRoles is provided
    if (allowedRoles && allowedRoles.length > 0) {
      if (cookies.user) {
        try {
          const user = JSON.parse(cookies.user);
          if (!allowedRoles.includes(user.role)) {
            throw redirect('/'); // Redirect to home if role not allowed
          }
        } catch (e) {
          throw redirect('/login');
        }
      } else {
        throw redirect('/login');
      }
    }
  } else {
    // On client, use authService
    if (!authService.isAuthenticated()) {
      throw redirect('/login');
    }
    
    // Check role if allowedRoles is provided
    if (allowedRoles && allowedRoles.length > 0) {
      const user = authService.getCurrentUser();
      if (!user || !allowedRoles.includes(user.role)) {
        throw redirect('/');
      }
    }
  }
  
  return true;
}

/**
 * Get current user from request cookies (server-side)
 */
export function getCurrentUserFromRequest(request: Request) {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) {
    return null;
  }
  
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {} as Record<string, string>);
  
  if (cookies.user) {
    try {
      return JSON.parse(cookies.user);
    } catch (e) {
      console.error('Failed to parse user from cookie:', e);
      return null;
    }
  }
  
  return null;
}
