import React from 'react';
import { PortableTextRenderer } from '@/components/ui/portableTextRenderer';
import './Region.scss';
import type { PAGE_CONTENT_QUERYResult } from 'sanity.types';
import builder from '@/utils/image';

type RegionType = NonNullable<PAGE_CONTENT_QUERYResult>['region'];
export interface RegionProps {
	data: RegionType | null;
}

export const Region: React.FC<RegionProps> = ({ data }) => {
	const imageUrl = data?.contentImage ? builder.ogUrl(data.contentImage) : null;
	const imageAlt = data?.contentImage?.alt ?? '';

	return (
		<article id="quartier" className="buurt">
			<h2 className="hidden">Qu'est-ce qu'Arnèke peut vous offrir, à vous et à votre future maison?</h2>

			{imageUrl && <img className="buurt-img" src={imageUrl} alt={imageAlt} loading="lazy" decoding="async" />}

			<div className="buurt-content">
				{data?.title && <h3>{data.title}</h3>}
				{data?.body && <PortableTextRenderer value={data.body} />}
			</div>
		</article>
	);
};
