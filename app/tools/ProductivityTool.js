import dynamic from 'next/dynamic';
const ProductivityTool = dynamic(() => import('./ProductivityTool.tsx').then(m => m.default), { ssr: false });
export default ProductivityTool;
