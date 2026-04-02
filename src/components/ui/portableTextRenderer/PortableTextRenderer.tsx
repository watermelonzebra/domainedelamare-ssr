import React from 'react';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { urlFor } from '@/utils/image';
import './PortableTextRenderer.scss';
import type { BlockContent } from 'sanity.types';

export interface PortableTextRendererProps {
	value: BlockContent;
	className?: string;
}

interface ImageValue {
	asset: unknown;
	alt?: string;
	caption?: string;
}

const components: PortableTextComponents = {
	types: {
		image: ({ value }: { value: ImageValue }) => {
			const src = urlFor(value.asset as any)
				.width(768)
				.auto('format')
				.url();
			return (
				<figure className="prose-image">
					<img src={src} alt={value.alt ?? ''} loading="lazy" decoding="async" />
					{value.caption && <figcaption>{value.caption}</figcaption>}
				</figure>
			);
		},
	},
};

export const PortableTextRenderer: React.FC<PortableTextRendererProps> = ({ value, className }) => (
	<div className={['prose', className].filter(Boolean).join(' ')}>
		<PortableText value={value as any} components={components} />
	</div>
);
