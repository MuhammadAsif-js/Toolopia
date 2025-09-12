import dynamic from 'next/dynamic';
const PdfMerger = dynamic(() => import('./PdfMerger.tsx').then(m => m.default), { ssr: false });
export default PdfMerger;
