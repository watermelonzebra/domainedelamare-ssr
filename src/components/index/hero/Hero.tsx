import React from 'react';
import { PortableTextRenderer } from '@/components/ui/portableTextRenderer';
import './Hero.scss';
import type { PAGE_CONTENT_QUERYResult } from 'sanity.types';
import { urlFor } from '@/utils/image';

type NewsletterType = NonNullable<PAGE_CONTENT_QUERYResult>['newsletter'];
export interface HeroProps {
	data: NewsletterType | null;
}

export const Hero: React.FC<HeroProps> = ({ data }) => {
	const title = data?.title || 'Nos actualités!';
	const body = data?.body;
	const imageUrl = data?.contentImage
		? urlFor(data.contentImage).width(1200).height(630).fit('crop').auto('format').url()
		: null;
	const imageAlt = data?.contentImage?.alt || title || 'Nos actualités!';

	return (
		<article className="fold">
			<h2 className="hidden">Toutes les dernières informations sur nos projets et nos offres.</h2>

			<p className="fold-title">
				<span className="appear-left">où les rêves</span>
				<span className="fold-title--highlight appear-right">trouvent une adresse</span>
			</p>

			<div className="fold-newsletter-container">
				{imageUrl && (
					<img className="fold-newsletter__image" fetchPriority="high" src={imageUrl} alt={imageAlt} loading="eager" />
				)}

				<div className="fold-newsletter">
					<h3 className="fold-newsletter--title">{title}</h3>
					{body && <PortableTextRenderer value={body} />}
					<a href="/#contact" className="btn btn--primary">
						Nous contacter
					</a>
				</div>
			</div>
		</article>
	);
};
