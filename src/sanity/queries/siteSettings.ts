import { loadQuery } from '@/lib/sanity.loader';
import type { QueryResponseInitial } from '@sanity/react-loader';
import type { SITE_SETTINGS_QUERYResult } from 'sanity.types';

import { SITE_SETTINGS_QUERY } from './siteSetting.queries';

export async function getSiteSettings(isDraftMode: boolean): Promise<QueryResponseInitial<SITE_SETTINGS_QUERYResult>> {
	return await loadQuery(SITE_SETTINGS_QUERY, undefined, {
		perspective: isDraftMode ? 'drafts' : 'published',
	});
}
