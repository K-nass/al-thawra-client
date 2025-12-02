import { useEffect, useState } from 'react';

/**
 * Hook to detect if code is running on client (after hydration)
 * Essential for SSR compatibility with React Router v7
 * 
 * Returns false during SSR and initial render, true after hydration
 * This prevents hydration mismatches and ensures browser APIs are only
 * accessed after the component has mounted on the client
 * 
 * @returns boolean - true if running on client after hydration
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
