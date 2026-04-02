import { useQuery } from '@/lib/sanity.store';

import './ProjectsPage.scss';

import type { QueryResponseInitial } from '@sanity/react-loader';
import type { POST_BY_SLUG_QUERYResult } from 'sanity.types';
import builder from '@/utils/image';
import { POST_BY_SLUG_QUERY } from '@/sanity/queries/posts.queries';

import Header from '@/components/projects/header';
import ImageGallery from '@/components/projects/ImageGallery';
import Content from '@/components/projects/content';
import { Icon } from '@/components/ui/Icon';

type Props = {
	initialPost: QueryResponseInitial<POST_BY_SLUG_QUERYResult>;
	isDraftMode: boolean;
	slug: string;
};

export default function ProjectPage({ initialPost, slug }: Props) {
	const { data: post } = useQuery(POST_BY_SLUG_QUERY, { slug }, { initial: initialPost });

	type ImageGallery = Array<{
		src?: string;
		thumb?: string;
		alt?: string;
	}>;
	const images: ImageGallery = [];

	function createImages() {
		images.push({
			src: post?.contentImage ? builder.ogUrl(post.contentImage) : undefined,
			thumb: post?.contentImage ? builder.thumbUrl(post.contentImage) : undefined,
			alt: post?.contentImage?.alt ?? post?.title ?? undefined,
		});

		if (!post?.imageGallery?.length) return;
		post.imageGallery.map((image) => {
			images.push({
				src: builder.ogUrl(image),
				thumb: builder.thumbUrl(image),
				alt: image.alt ?? post.title ?? undefined,
			});
		});
	}
	createImages();

	return (
		<>
			<section>
				<h2 className="hidden">{post?.title}</h2>

				<nav>
					<a href="/" className="back-button">
						<Icon type="chevron-left" stroke={1.2} />
						<span>Retour à notre offres</span>
					</a>
				</nav>

				<Header post={post} />
				<ImageGallery images={images} />
				<Content post={post} />
			</section>
		</>
	);
}
