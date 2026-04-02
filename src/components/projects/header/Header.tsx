import React from 'react';
import './Header.scss';
import type { POST_BY_SLUG_QUERYResult } from 'sanity.types';

export interface HeaderProps {
	post: POST_BY_SLUG_QUERYResult;
}

export const Header: React.FC<HeaderProps> = ({ post }) => {
	const { city, country, street } = post?.location ?? {};
	const showCityCountry = city || country;
	const citySeparator = city && country ? ',' : '';

	return (
		<article className="details-header">
			<div className="details-header__info appear-left">
				<p>{post?.title}</p>
				<span>
					<i className="ti ti-map-pin" aria-hidden="true" />
					<address>
						{street && <span>{street}</span>}
						{showCityCountry && (
							<span>
								{city}
								{citySeparator} {country}
							</span>
						)}
					</address>
				</span>
			</div>

			{post?.price && (
				<div className="details-header__price appear-right">
					<p>€{post.price}</p>
					<span>prix hors TVA</span>
				</div>
			)}
		</article>
	);
};
