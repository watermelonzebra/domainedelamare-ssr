/**
 * src/sanity/queries/posts.ts
 * All post-related GROQ queries.
 *
 * Rules:
 * - Always use defineQuery() — enables Sanity TypeGen type inference
 * - Always project only the fields you need (never bare *[_type=="post"])
 * - Always include _key in array projections
 * - Order BEFORE slice: | order(publishedAt desc)[0...N]
 * - Use $params not string interpolation
 */

import { sanityClient } from 'sanity:client';
import { type QueryResponseInitial } from '@sanity/react-loader';
import { loadQuery } from '@/lib/sanity.loader';
import type { POST_BY_SLUG_QUERYResult, POST_SLUGS_QUERYResult, POSTS_SUMMARY_QUERYResult } from 'sanity.types';

import { POSTS_SUMMARY_QUERY, POST_SLUGS_QUERY, POST_BY_SLUG_QUERY } from './posts.queries';

// ── Inferred Types (via TypeGen's overloadClientMethods) ───

export type PostSummary = NonNullable<Awaited<ReturnType<typeof getPosts>>>;
export type Post = NonNullable<Awaited<ReturnType<typeof getPost>>>;

// ── Fetcher Functions ──────────────────────────────────────

/**
 * Fetch all post summaries.
 */
export async function getPosts(isDraftMode: boolean): Promise<QueryResponseInitial<POSTS_SUMMARY_QUERYResult>> {
	return await loadQuery(
		POSTS_SUMMARY_QUERY,
		{},
		{
			perspective: isDraftMode ? 'drafts' : 'published',
		},
	);
}

/**
 * Fetch a single post by slug.
 */
export async function getPost(
	slug: string,
	isDraftMode: boolean,
): Promise<QueryResponseInitial<POST_BY_SLUG_QUERYResult>> {
	return await loadQuery(
		POST_BY_SLUG_QUERY,
		{ slug },
		{
			perspective: isDraftMode ? 'drafts' : 'published',
		},
	);
}

/**
 * Fetch all slugs (for getStaticPaths).
 */
export async function getPostSlugs(): Promise<string[]> {
	const results = (await sanityClient.fetch(POST_SLUGS_QUERY)) as POST_SLUGS_QUERYResult;
	return results.map((r) => r.slug).filter((r) => r !== null);
}
