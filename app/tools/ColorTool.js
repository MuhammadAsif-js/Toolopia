import dynamic from 'next/dynamic';
const ColorTool = dynamic(() => import('./ColorTool.tsx').then(m => m.default), { ssr: false });
export default ColorTool;
