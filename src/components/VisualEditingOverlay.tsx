// src/components/VisualEditingOverlay.tsx
import { enableVisualEditing } from '@sanity/visual-editing';
import { useEffect } from 'react';

export function VisualEditingOverlay() {
	useEffect(() => {
		return enableVisualEditing({
			refresh: async () => {
				window.location.reload();
			},
		});
	}, []);
	return null;
}
