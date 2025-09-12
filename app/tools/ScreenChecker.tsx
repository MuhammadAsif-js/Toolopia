```tsx
'use client';
import React, { useEffect, useState } from 'react';

export default function ScreenChecker() {
	const [available, setAvailable] = useState(false);

	useEffect(() => {
		// Guard access to window to avoid SSR crash
		if (typeof window !== 'undefined') {
			// perform any browser-only checks here
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
```