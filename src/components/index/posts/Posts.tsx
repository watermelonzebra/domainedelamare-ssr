import React from 'react';
import { Post } from '@/components/index/post';
import './Posts.scss';
import { type POSTS_SUMMARY_QUERYResult } from 'sanity.types';

export interface PostsProps {
	posts: POSTS_SUMMARY_QUERYResult;
}

export const Posts: React.FC<PostsProps> = ({ posts }) => (
	<article className="posts">
		<h2>Nos offres</h2>

		{posts.length > 0 ? (
			<ul className={`posts-list --${posts.length}`} aria-label="All posts" role="list">
				{posts.map((post) => (
					<Post key={post.slug?.current} post={post} />
				))}
			</ul>
		) : (
			<div className="posts-no-offers">
				<h3>Aucune offre disponible</h3>
				<p>Contactez-nous pour plus d'informations.</p>
				<a href="/#contact" className="btn btn--background">
					Contactez-nous
				</a>
			</div>
		)}
	</article>
);
