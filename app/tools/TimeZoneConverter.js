import dynamic from 'next/dynamic';
const TimeZoneConverter = dynamic(() => import('./TimeZoneConverter.tsx').then(m => m.default), { ssr: false });
export default TimeZoneConverter;
