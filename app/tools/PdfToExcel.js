import dynamic from 'next/dynamic';
const PdfToExcel = dynamic(() => import('./PdfToExcel.tsx').then(m => m.default), { ssr: false });
export default PdfToExcel;
