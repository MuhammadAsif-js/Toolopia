'use client';
import React, { useEffect, useState } from 'react';

export default function ScreenChecker(): JSX.Element {
	// Local state used only on client
	const [available, setAvailable] = useState(false);
	const [screenInfo, setScreenInfo] = useState<{ width?: number; height?: number } | null>(null);

	useEffect(() => {
		// Guard access to window to avoid SSR/build crashes
		if (typeof window === 'undefined') return;

		// Browser-only logic
		setAvailable(true);
		setScreenInfo({ width: window.screen?.width, height: window.screen?.height });

		// Example: listen for resize if you need live updates
		const onResize = () => {
			setScreenInfo({ width: window.innerWidth, height: window.innerHeight });
		};
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	return (
		<div>
			{available ? (
				<>
					<p>Screen Checker loaded (client)</p>
					{screenInfo ? (
						<p>
							Width: {screenInfo.width} px — Height: {screenInfo.height} px
						</p>
					) : (
						<p>Gathering screen info…</p>
					)}
				</>
			) : (
				<p>Screen Checker unavailable during server render</p>
			)}
		</div>
	);
}