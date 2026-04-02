// src/components/index/HomePage.tsx
import { useQuery } from '@/lib/sanity.client';

import './HomePage.scss';

import Hero from '@/components/index/hero';
import Posts from '@/components/index/posts';
import Region from '@/components/index/region';
import Contact from '@/components/index/contact';

import { PAGE_CONTENT_QUERY } from '@/sanity/queries/pageContent.queries';
import { POSTS_SUMMARY_QUERY } from '@/sanity/queries/posts.queries';
import { type QueryResponseInitial } from '@sanity/react-loader';
import type { PAGE_CONTENT_QUERYResult, POSTS_SUMMARY_QUERYResult } from 'sanity.types';


type Props = {
	initialPageContent: QueryResponseInitial<PAGE_CONTENT_QUERYResult>;
	initialPosts: QueryResponseInitial<POSTS_SUMMARY_QUERYResult>;
	isDraftMode: boolean;
};

export default function HomePage({ initialPageContent, initialPosts, isDraftMode }: Props) {
	console.log('[HomePage] isDraftMode:', isDraftMode);

	const { data: pageContent } = useQuery(PAGE_CONTENT_QUERY, {}, { initial: initialPageContent });

	const { data: posts } = useQuery(POSTS_SUMMARY_QUERY, {}, { initial: initialPosts });
	console.log('[useQuery] sourceMap:', (initialPosts as any).sourceMap ? '✅' : '❌');

	return (
		<>
			<section>
				<Hero data={pageContent?.newsletter || null} isDraftMode />
				<Posts posts={posts} />
				<Region data={pageContent?.region || null} />
				<Contact data={pageContent?.contactData || null} />
			</section>
		</>
	);
}
