import dynamic from 'next/dynamic';
const CurrencyConverter = dynamic(() => import('./CurrencyConverter.tsx').then(m => m.default), { ssr: false });
export default CurrencyConverter;
