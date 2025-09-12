import dynamic from 'next/dynamic';
const TypingTest = dynamic(() => import('./TypingTest.tsx').then(m => m.default), { ssr: false });
export default TypingTest;
