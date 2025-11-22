/**
 * Performance utilities for video player optimization
 * All utilities are SSR-safe and work with React Router v7
 */

/**
 * Throttle function - limits function execution to once per specified delay
 * SSR-safe: Works on both server and client
 * 
 * @param func - Function to throttle
 * @param delay - Minimum time between function calls in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function throttled(...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    // Clear any pending timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (timeSinceLastCall >= delay) {
      lastCall = now;
      func(...args);
    } else {
      // Schedule the function to run after the remaining delay
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
        timeoutId = null;
      }, delay - timeSinceLastCall);
    }
  };
}

/**
 * Debounce function - delays function execution until after specified delay has elapsed
 * since the last time it was invoked
 * SSR-safe: Works on both server and client
 * 
 * @param func - Function to debounce
 * @param delay - Time to wait before executing function in milliseconds
 * @returns Debounced function with cancel method
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

/**
 * RequestAnimationFrame wrapper with fallback for SSR
 * Uses requestAnimationFrame on client, setTimeout on server
 * 
 * @param callback - Function to execute on next frame
 * @returns Cancel function
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  callback: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  let latestArgs: Parameters<T> | null = null;

  return function throttled(...args: Parameters<T>) {
    latestArgs = args;

    if (rafId !== null) {
      return;
    }

    // SSR-safe: Check if requestAnimationFrame is available
    if (typeof requestAnimationFrame !== 'undefined') {
      rafId = requestAnimationFrame(() => {
        if (latestArgs) {
          callback(...latestArgs);
        }
        rafId = null;
        latestArgs = null;
      });
    } else {
      // Fallback for SSR
      setTimeout(() => {
        if (latestArgs) {
          callback(...latestArgs);
        }
        rafId = null;
        latestArgs = null;
      }, 16); // ~60fps
    }
  };
}

/**
 * Memoization helper for expensive calculations
 * Caches results based on a string key
 * 
 * @param fn - Function to memoize
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Cleanup utility for throttled/debounced functions
 * Call this in useEffect cleanup to prevent memory leaks
 */
export function cleanupThrottledFunctions(
  ...funcs: Array<{ cancel?: () => void } | ((...args: any[]) => void)>
): void {
  funcs.forEach(func => {
    if (func && typeof func === 'object' && 'cancel' in func && typeof func.cancel === 'function') {
      func.cancel();
    }
  });
}

/**
 * Check if code is running on client (browser)
 * SSR-safe utility
 */
export const isClient = typeof window !== 'undefined';

/**
 * Check if code is running on server
 * SSR-safe utility
 */
export const isServer = !isClient;
