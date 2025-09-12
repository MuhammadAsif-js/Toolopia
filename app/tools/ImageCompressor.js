import dynamic from 'next/dynamic';
const ImageCompressor = dynamic(() => import('./ImageCompressor.tsx').then(m => m.default), { ssr: false });
export default ImageCompressor;
