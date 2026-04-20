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
import { stegaClean } from '@sanity/client/stega';

type Props = {
	initialPost: QueryResponseInitial<POST_BY_SLUG_QUERYResult>;
	isDraftMode: boolean;
	slug: string;
};

export default function ProjectPage({ initialPost, slug, isDraftMode }: Props) {
	const { data: post } = useQuery(POST_BY_SLUG_QUERY, { slug }, { initial: initialPost });

	const postData = isDraftMode ? post : stegaClean(post);

	type ImageGallery = Array<{
		src?: string;
		thumb?: string;
		alt?: string;
	}>;
	const images: ImageGallery = [];

	function createImages() {
		images.push({
			src: postData?.contentImage ? builder.ogUrl(postData.contentImage) : undefined,
			thumb: postData?.contentImage ? builder.thumbUrl(postData.contentImage) : undefined,
			alt: postData?.contentImage?.alt ?? postData?.title ?? undefined,
		});

		if (!postData?.imageGallery?.length) return;
		postData.imageGallery.map((image) => {
			images.push({
				src: builder.ogUrl(image),
				thumb: builder.thumbUrl(image),
				alt: image.alt ?? postData.title ?? undefined,
			});
		});
	}
	createImages();

	return (
		<section id="offres">
			<h2 className="hidden">{postData?.title}</h2>

			<nav>
				<a href="/" className="back-button">
					<Icon type="chevron-left" stroke={1.2} />
					<span>Retour à notre offres</span>
				</a>
			</nav>

			<Header post={postData} />
			<ImageGallery images={images} />
			<Content post={postData} />
		</section>
	);
}
