import dynamic from 'next/dynamic';

// Dynamically import the TSX ScreenChecker client-side to prevent SSR "window is not defined" and satisfy './ScreenChecker' imports
const ScreenChecker = dynamic(() => import('./ScreenChecker.tsx').then(m => m.default), { ssr: false });

export default ScreenChecker;
