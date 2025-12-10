/**
 * Cookie utilities for server-side request handling
 */

/**
 * Extract cookies from a Request object
 * @param request - The Request object containing cookie headers
 * @returns Object with cookie key-value pairs
 */
export function getCookiesFromRequest(request: Request): Record<string, string> {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return {};
  
  return cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Get a specific cookie value from a Request object
 * @param request - The Request object containing cookie headers
 * @param name - The name of the cookie to retrieve
 * @returns The cookie value or undefined if not found
 */
export function getCookieFromRequest(request: Request, name: string): string | undefined {
  const cookies = getCookiesFromRequest(request);
  return cookies[name];
}
