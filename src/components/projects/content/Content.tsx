import React from 'react';
import { PortableTextRenderer } from '@/components/ui/portableTextRenderer';
import PDFThumbnail from '@/components/projects/pdfThumbnail';
import { Icon } from '@/components/ui/Icon';
import { getSanityFileUrl } from '@/utils/file';

import HouseLandArea from '../../../images/tabler_home-2.svg';
import './Content.scss';
import type { POST_BY_SLUG_QUERYResult } from 'sanity.types';

export interface ContentProps {
	post: POST_BY_SLUG_QUERYResult;
}

type FeatureKey = 'bedrooms' | 'landArea' | 'bathrooms' | 'livableArea' | 'garage';

const featureIconMap: Record<FeatureKey, React.ReactNode> = {
	bedrooms: <Icon type="bed" />,
	landArea: <Icon type="landArea" />,
	bathrooms: <Icon type="bath" />,
	livableArea: <img src={HouseLandArea.src} aria-hidden="true" />,
	garage: <Icon type="garage" />,
};

export const Content: React.FC<ContentProps> = ({ post }) => {
	const postFeatures = Object.entries(post?.features ?? {}).map(([key, value]) => ({
		key,
		value: value as number,
	}));

	const floorplanUrl = post?.floorplan ? getSanityFileUrl(post.floorplan) : undefined;
	const floorplanFilename = post?.floorplan?.originalFilename
		? (post?.floorplan?.originalFilename ?? 'Floorplan.pdf')
		: undefined;

	return (
		<article className="content">
			<h3 className="hidden">
				Découvrez tout ce qu'il faut savoir sur le logement, de sa superficie au nombre de salles de bains.
			</h3>

			<div className="content-features">
				<ul className="content-features__list">
					{postFeatures.map((feature) => (
						<li key={feature.key} className="content-features__list-item" title={feature.key}>
							{featureIconMap[feature.key as FeatureKey] ?? null}
							<p>{feature.value}</p>
						</li>
					))}
				</ul>
			</div>

			<div className="content-description">
				<h4>Description</h4>
				{post?.body && <PortableTextRenderer value={post?.body} />}
			</div>

			<div className="content-contact">
				<h4>
					<Icon type="messages" stroke={2.5} />
					<span>Soyez rapide!</span>
				</h4>
				<p>Vous avez des questions ou vous souhaitez planifier une visite?</p>
				<a href="/#contact" className="btn btn--primary">
					<span>Contactez-nous</span>
				</a>
			</div>

			{post?.floorplan && floorplanFilename && floorplanUrl && (
				<div className="content-floorplan">
					<h4>le plan du logement</h4>
					<PDFThumbnail
						file={getSanityFileUrl(post.floorplan)}
						fileName={post.floorplan.originalFilename || 'Floorplan.pdf'}
						width={500}
					/>
				</div>
			)}
		</article>
	);
};
