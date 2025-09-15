import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the TSX ScreenChecker client-side to prevent SSR "window is not defined" and satisfy './ScreenChecker' imports
const ScreenChecker = dynamic(() => import('./ScreenChecker.tsx').then(m => m.default), { ssr: false });

export default function ScreenChecker() {
  // Prevent any window access during SSR by only enabling client behavior after mount.
  const [isClient, setIsClient] = useState(false);
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  useEffect(() => {
    // now we're guaranteed to be running in the browser
    setIsClient(true);

    if (typeof window === 'undefined') return;

    const updateSize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  if (!isClient) {
    // Render a placeholder during SSR / prerendering
    return null;
  }

  return (
    <div className="screen-checker">
      <h3 className="font-medium text-lg mb-2">Screen Checker</h3>
      <div>
        <p className="text-muted-foreground">Width: {width ?? '—'}</p>
        <p className="text-muted-foreground">Height: {height ?? '—'}</p>
      </div>
      {/* ...existing code... */}
    </div>
  );
}
