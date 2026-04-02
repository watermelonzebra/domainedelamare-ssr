import type { SanityAsset } from '@sanity/image-url/lib/types/types';

export function getSanityFileUrl(asset: SanityAsset) {
	if (!asset?.url) return '';
	return asset.url;
}
