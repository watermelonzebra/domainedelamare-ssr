// src/lib/sanity.browser-client.ts
import { createClient } from '@sanity/client';

export const browserClient = createClient({
	projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
	dataset: import.meta.env.PUBLIC_SANITY_DATASET,
	apiVersion: '2026-01-01',
	
	stega: {
		enabled: true,
		studioUrl: import.meta.env.PUBLIC_SANITY_STUDIO_URL,
	},
});
