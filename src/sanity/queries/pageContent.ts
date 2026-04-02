import { loadQuery } from '@/lib/sanity.loader';
import type { PAGE_CONTENT_QUERYResult } from 'sanity.types';
import type { QueryResponseInitial } from '@sanity/react-loader';

import {
	PAGE_CONTENT_QUERY,
	PAGE_CONTENT_SOCIALS_QUERY,
	PAGE_CONTENT_NEWSLETTER_QUERY,
	PAGE_CONTENT_REGION_QUERY,
	PAGE_CONTENT_CONTACT_QUERY,
} from './pageContent.queries';

// Fetch all website content data
export async function getPageContent(
	isDraftMode: boolean,
	type?: 'social' | 'region' | 'contact' | 'news',
): Promise<QueryResponseInitial<PAGE_CONTENT_QUERYResult>> {
	switch (type) {
		case 'contact':
			return await loadQuery(
				PAGE_CONTENT_CONTACT_QUERY,
				{},
				{
					perspective: isDraftMode ? 'drafts' : 'published',
				},
			);
		case 'social':
			return await loadQuery(
				PAGE_CONTENT_SOCIALS_QUERY,
				{},
				{
					perspective: isDraftMode ? 'drafts' : 'published',
				},
			);
		case 'region':
			return await loadQuery(
				PAGE_CONTENT_REGION_QUERY,
				{},
				{
					perspective: isDraftMode ? 'drafts' : 'published',
				},
			);
		case 'news':
			return await loadQuery(
				PAGE_CONTENT_NEWSLETTER_QUERY,
				{},
				{
					perspective: isDraftMode ? 'drafts' : 'published',
				},
			);

		default:
			return await loadQuery(
				PAGE_CONTENT_QUERY,
				{},
				{
					perspective: isDraftMode ? 'drafts' : 'published',
				},
			);
	}
}
