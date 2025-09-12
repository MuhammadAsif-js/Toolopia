'use client';
import React, { useEffect, useState } from 'react';

export default function ScreenChecker(): JSX.Element {
	const [available, setAvailable] = useState(false);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			// browser-only logic here (guarded)
			setAvailable(true);
		}
	}, []);

	return (
		<div>
			{available
				? 'Screen Checker loaded (client)'
				: 'Screen Checker unavailable during server render'}
		</div>
	);
}