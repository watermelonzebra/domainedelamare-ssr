import React, { useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import './Post.scss';
import type { POSTS_SUMMARY_QUERYResult } from 'sanity.types';
import builder from '@/utils/image';
import { stegaClean } from '@sanity/client/stega';

export interface PostProps {
	post: POSTS_SUMMARY_QUERYResult[0];
}

export const Post: React.FC<PostProps> = ({ post }) => {
	const { city, country, street } = post.location ?? {};
	const showCityCountry = city || country;
	const citySeparator = city && country ? ',' : '';

	const imageUrl = post.contentImage ? builder.thumbUrl(post.contentImage, 450, 70) : undefined;
	const imageAlt = stegaClean(post.contentImage?.alt) ?? stegaClean(post.title) ?? undefined;

	function applyDraftToLinks() {
		const isDraft = new URLSearchParams(window.location.search).get('draft') === 'true';
		if (!isDraft) return;

		const postListItems = document.querySelectorAll('.post-list-item');

		setTimeout(() => {
			postListItems.forEach((link) => {
				const linkElement = link.querySelector('a');
				if (!linkElement) return;

				const url = new URL(linkElement.href);
				if (!url.searchParams.has('draft')) {
					url.searchParams.set('draft', 'true');
					// Preserve hash e.g. /#contact
					linkElement.setAttribute('href', url.pathname + url.search + url.hash);
				}
			});
		});
	}

	// Run on initial load
	applyDraftToLinks();

	useEffect(() => {
		return applyDraftToLinks();
	}, [post]);

	return (
		<li className="post-list-item">
			<a href={`/projects/${post.slug?.current}`} className="post-list-item__link">
				{post.contentImage && <img className="post-list-item__img" src={imageUrl} alt={imageAlt} loading="lazy" />}

				{post.price && <p className="post-list-item__price">€{post.price}</p>}

				<div className={`post-list-item__info${!post.price ? ' margin-top' : ''}`}>
					<h3 className="post-list-item__info-title">{stegaClean(post.title)}</h3>

					<p className="post-list-item__info-location">
						{street && (
							<>
								<span>{stegaClean(street)}</span>
								<br />
							</>
						)}
						{showCityCountry && (
							<span>
								{stegaClean(city)}
								{citySeparator} {stegaClean(country)}
							</span>
						)}
					</p>

					<ul className="post-list-item__info-features">
						<li className="post-list-item__info-feature-item">
							<Icon type="bed" />
							<p>{post.features?.bedrooms || 0}</p>
						</li>
						<li className="post-list-item__info-feature-item --small">
							<Icon type="landArea" />
							<p>{post.features?.landArea || 0}</p>
						</li>
						<li className="post-list-item__info-feature-item">
							<Icon type="bath" />
							<p>{post.features?.bathrooms || 0}</p>
						</li>
					</ul>
				</div>
			</a>
		</li>
	);
};
