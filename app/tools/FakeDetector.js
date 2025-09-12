import dynamic from 'next/dynamic';

// Dynamically import the TSX component client-side to satisfy imports that expect './FakeDetector'
const FakeDetector = dynamic(() => import('./FakeDetector.tsx').then(m => m.default), { ssr: false });

export default FakeDetector;
