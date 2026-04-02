// src/lib/sanity.store.ts
import { createQueryStore } from '@sanity/react-loader';

export const { loadQuery, useQuery, setServerClient } = createQueryStore({
	client: false,
	ssr: true,
});
