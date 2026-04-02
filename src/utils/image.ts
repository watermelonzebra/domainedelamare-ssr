/**
 * src/utils/image.ts
 * Sanity image URL builder.
 * Always use this helper — never construct CDN URLs manually.
 *
 * Usage:
 *   urlFor(source).width(800).height(600).fit('crop').auto('format').url()
 */
import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from 'sanity:client';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
	return builder.image(source);
}

// ImageBuilder
/**
 * imageBuilder.ts
 *
 * A fully-typed, production-grade Sanity image utility that covers:
 *  - Hotspot / crop-aware URL generation
 *  - LQIP blur placeholders
 *  - Responsive srcSet + sizes generation
 *  - Auto-format (WebP / AVIF via Sanity CDN)
 *  - Aspect-ratio locking
 *  - Art-direction breakpoints
 *  - Palette / dominant-colour extraction
 *  - DPR-aware scaling
 *  - Strict TypeScript types derived from the Sanity Image interface
 */

// ─── Sanity Image Interface Types ────────────────────────────────────────────

/**
 * Full Sanity image asset reference as returned by a dereferenced GROQ query.
 * Corresponds to the Sanity `image` schema type with hotspot enabled.
 *
 * GROQ query to hydrate this fully:
 *
 *   image {
 *     asset->{
 *       _id,
 *       _type,
 *       url,
 *       mimeType,
 *       size,
 *       metadata {
 *         lqip,
 *         blurHash,
 *         hasAlpha,
 *         isOpaque,
 *         dimensions { width, height, aspectRatio },
 *         palette {
 *           dominant { background, foreground, population, title },
 *           darkMuted  { background, foreground, population, title },
 *           darkVibrant { background, foreground, population, title },
 *           lightMuted  { background, foreground, population, title },
 *           lightVibrant{ background, foreground, population, title },
 *           muted       { background, foreground, population, title },
 *           vibrant     { background, foreground, population, title }
 *         }
 *       }
 *     },
 *     hotspot { x, y, height, width },
 *     crop    { top, bottom, left, right },
 *     alt
 *   }
 */

export interface SanityImageDimensions {
	width: number;
	height: number;
	aspectRatio: number;
}

export interface SanityPaletteSwatch {
	background: string;
	foreground: string;
	population: number;
	title: string;
}

export interface SanityImagePalette {
	dominant?: SanityPaletteSwatch;
	darkMuted?: SanityPaletteSwatch;
	darkVibrant?: SanityPaletteSwatch;
	lightMuted?: SanityPaletteSwatch;
	lightVibrant?: SanityPaletteSwatch;
	muted?: SanityPaletteSwatch;
	vibrant?: SanityPaletteSwatch;
}

export interface SanityImageMetadata {
	/** Base-64 encoded LQIP (Low-Quality Image Placeholder). */
	lqip?: string;
	/** Blurhash string (alternative to LQIP). */
	blurHash?: string;
	hasAlpha?: boolean;
	isOpaque?: boolean;
	dimensions?: SanityImageDimensions;
	palette?: SanityImagePalette;
}

export interface SanityImageAsset {
	_id: string;
	_type: 'sanity.imageAsset';
	url: string;
	mimeType?: string;
	/** File size in bytes */
	size?: number;
	metadata?: SanityImageMetadata;
}

export interface SanityImageHotspot {
	/** Normalised 0–1 horizontal focal point */
	x: number;
	/** Normalised 0–1 vertical focal point */
	y: number;
	/** Normalised 0–1 hotspot height */
	height: number;
	/** Normalised 0–1 hotspot width */
	width: number;
}

export interface SanityImageCrop {
	top: number;
	bottom: number;
	left: number;
	right: number;
}

/** The full Sanity image document as it should be queried from your schema. */
export interface SanityImage {
	_type?: 'image';
	asset: SanityImageAsset;
	hotspot?: SanityImageHotspot;
	crop?: SanityImageCrop;
	/** Alt text field added to the image schema definition. */
	alt?: string;
}

// ─── Types for imageUrl ──────────────────────────────────────────────────────

export type ImageFit = 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
export type ImageCrop = 'top' | 'bottom' | 'left' | 'right' | 'center' | 'focalpoint' | 'entropy';
export type ImageFormat = 'jpg' | 'png' | 'webp' | 'auto';

export interface ImageUrlOptions {
	/**
	 * Desired output width in CSS pixels.
	 * The CDN will scale the image to fit within this width.
	 */
	width?: number;

	/**
	 * Desired output height in CSS pixels.
	 * If omitted, height is derived from the aspect ratio.
	 */
	height?: number;

	/**
	 * Explicit aspect ratio as a number (width / height).
	 * Overrides any height calculation.
	 * e.g. 16/9, 4/3, 1 (square)
	 */
	aspectRatio?: number;

	/**
	 * How the image should be resized / cropped.
	 * Defaults to "crop" which respects hotspot data.
	 */
	fit?: ImageFit;

	/**
	 * Where to focus when cropping (fallback when no hotspot is stored).
	 * Defaults to "focalpoint" which defers to the Sanity hotspot.
	 */
	crop?: ImageCrop;

	/**
	 * Image format override. Defaults to "auto" so the CDN negotiates
	 * WebP / AVIF for supporting browsers.
	 */
	format?: ImageFormat;

	/**
	 * JPEG / WebP quality, 0–100.
	 * Defaults to 80 for a sharp, lightweight balance.
	 */
	quality?: number;

	/**
	 * Add a blur effect (1–2000). Useful for LQIP generation server-side.
	 */
	blur?: number;

	/**
	 * Sharpen the image (0–100).
	 */
	sharpen?: number;

	/**
	 * Whether to flip the image.
	 */
	flip?: 'h' | 'v' | 'hv';

	/**
	 * Minimum image width when using srcSet generation. Defaults to 320.
	 */
	minWidth?: number;

	/**
	 * Device pixel ratio multiplier for retina screens (1–3).
	 * Useful when you need a single hi-res URL rather than a srcSet.
	 */
	dpr?: number;
}

// ─── imageUrl ─────────────────────────────────────────────────────────────────

/**
 * Builds a single, optimised image URL from a Sanity image object.
 *
 * - Respects hotspot / crop automatically.
 * - Defaults to `fit: "crop"` and `crop: "focalpoint"` so the CDN
 *   always delivers the right focal region.
 * - Defaults to `format: "auto"` so modern browsers receive WebP / AVIF.
 * - Defaults to `quality: 80` for a good size/quality trade-off.
 *
 * @example
 * const src = imageUrl(hero, { width: 1200, aspectRatio: 16/9 });
 */
export function imageUrl(image: SanityImage | SanityImageSource, options: ImageUrlOptions = {}): string {
	const {
		width,
		height,
		aspectRatio,
		fit = 'crop',
		crop = 'focalpoint',
		format = 'auto',
		quality = 80,
		blur,
		sharpen,
		dpr,
	} = options;

	let builder = urlFor(image)
		.fit(fit)
		.crop(crop);

	if (format === 'auto') {
		builder = builder.auto('format');
	} else {
		builder = builder.format(format);
	}

	builder = builder.quality(quality);

	if (width) {
		const scaledWidth = dpr ? width * dpr : width;
		builder = builder.width(Math.round(scaledWidth));
	}

	if (height) {
		const scaledHeight = dpr ? height * dpr : height;
		builder = builder.height(Math.round(scaledHeight));
	} else if (width && aspectRatio) {
		const computedHeight = dpr ? Math.round((width * dpr) / aspectRatio) : Math.round(width / aspectRatio);
		builder = builder.height(computedHeight);
	}

	if (blur !== undefined) builder = builder.blur(blur);
	if (sharpen !== undefined) builder = builder.sharpen(sharpen);

	return builder.url();
}

// ─── Types for imageSrcSet ────────────────────────────────────────────────────

export interface SrcSetOptions extends Omit<ImageUrlOptions, 'width' | 'dpr'> {
	/**
	 * Breakpoint widths (in CSS pixels) for which to generate srcSet entries.
	 * Defaults to a standard responsive ladder: [320, 480, 640, 750, 828, 1080, 1200, 1920, 2560]
	 */
	widths?: number[];

	/**
	 * Maximum width the image will ever be rendered at (CSS pixels).
	 * Entries above this are omitted.
	 */
	maxWidth?: number;
}

export interface SrcSetResult {
	/** Full `srcset` attribute value, e.g. "url 320w, url 640w, ..." */
	srcSet: string;
	/** Smallest URL – safe as `src` fallback for browsers without srcSet support. */
	src: string;
	/** Largest URL – useful as `og:image` or high-res target. */
	largest: string;
}

// ─── imageSrcSet ──────────────────────────────────────────────────────────────

const DEFAULT_WIDTHS = [320, 480, 640, 750, 828, 1080, 1200, 1920, 2560];

/**
 * Generates a full responsive `srcset` string for a Sanity image.
 *
 * Each entry in the ladder is width-described (`320w`, `640w`, …).
 * The returned `src` is the smallest entry, making it safe as a fallback.
 *
 * @example
 * const { srcSet, src } = imageSrcSet(hero, {
 *   aspectRatio: 16 / 9,
 *   maxWidth: 1920,
 * });
 *
 * <img src={src} srcSet={srcSet} sizes="(max-width: 768px) 100vw, 50vw" />
 */
export function imageSrcSet(image: SanityImage | SanityImageSource, options: SrcSetOptions = {}): SrcSetResult {
	const {
		widths = DEFAULT_WIDTHS,
		maxWidth,
		aspectRatio,
		fit = 'crop',
		crop = 'focalpoint',
		format = 'auto',
		quality = 80,
		blur,
		sharpen,
		flip,
	} = options;

	// Respect the source image's natural width as a hard ceiling
	const nativeWidth = (image as SanityImage)?.asset?.metadata?.dimensions?.width ?? Infinity;

	const filteredWidths = widths.filter((w) => {
		if (maxWidth && w > maxWidth) return false;
		if (w > nativeWidth) return false;
		return true;
	});

	// Always include at least one entry
	const ladder = filteredWidths.length > 0 ? filteredWidths : [Math.min(widths[0], nativeWidth)];

	const entries = ladder.map((w) => {
		const url = imageUrl(image, {
			width: w,
			aspectRatio,
			fit,
			crop,
			format,
			quality,
			blur,
			sharpen,
			flip,
		});
		return `${url} ${w}w`;
	});

	return {
		srcSet: entries.join(', '),
		src: imageUrl(image, { width: ladder[0], aspectRatio, fit, crop, format, quality }),
		largest: imageUrl(image, {
			width: ladder[ladder.length - 1],
			aspectRatio,
			fit,
			crop,
			format,
			quality,
		}),
	};
}

// ─── Types for imageProps ─────────────────────────────────────────────────────

export interface ArtDirectionBreakpoint {
	/** CSS media query, e.g. "(max-width: 767px)" */
	media: string;
	/** Width to render at this breakpoint */
	width: number;
	/** Aspect ratio at this breakpoint (optional, falls back to default) */
	aspectRatio?: number;
}

export interface ImagePropsOptions extends SrcSetOptions {
	/**
	 * The `sizes` attribute string.
	 * When omitted and art-direction breakpoints are provided, a `sizes`
	 * string is generated automatically from them.
	 */
	sizes?: string;

	/**
	 * Art-direction breakpoints.
	 * Each entry maps a media query to a width (and optionally an aspect ratio).
	 * The srcSet and sizes are computed from these automatically.
	 */
	artDirection?: ArtDirectionBreakpoint[];

	/**
	 * When true, the LQIP is included as `blurDataURL`.
	 * Requires the image to be queried with `asset->{ metadata { lqip } }`.
	 */
	includeLqip?: boolean;

	/**
	 * Fallback width if the image has no dimensions metadata.
	 * Defaults to 1200.
	 */
	fallbackWidth?: number;
}

export interface ImageProps {
	src: string;
	srcSet: string;
	sizes?: string;
	width: number;
	height: number;
	alt: string;
	/** Present when `includeLqip: true` and LQIP data is available. */
	blurDataURL?: string;
	/** Dominant background colour from the Sanity palette (hex). */
	dominantColor?: string;
	/** The natural aspect ratio of the source image. */
	aspectRatio: number;
}

// ─── imageProps ───────────────────────────────────────────────────────────────

/**
 * Returns a complete set of image props ready for use in any `<img>` tag or
 * framework Image component (Next.js, Astro Image, Nuxt Image, etc.).
 *
 * Includes:
 *  - Responsive `srcSet` across the default width ladder
 *  - Computed `width` / `height` for CLS-free rendering
 *  - LQIP `blurDataURL` for instant blur-up placeholders
 *  - Dominant colour for skeleton / background fill
 *  - Optional art-direction overrides per breakpoint
 *
 * @example – Standard responsive hero
 * const props = imageProps(page.hero, {
 *   aspectRatio: 16 / 9,
 *   sizes: "(max-width: 768px) 100vw, 1200px",
 *   includeLqip: true,
 * });
 * <img {...props} loading="lazy" decoding="async" />
 *
 * @example – Art-direction (different crop on mobile)
 * const props = imageProps(page.hero, {
 *   artDirection: [
 *     { media: "(max-width: 639px)", width: 640, aspectRatio: 1 },
 *     { media: "(min-width: 640px)", width: 1200, aspectRatio: 16 / 9 },
 *   ],
 *   includeLqip: true,
 * });
 */
export function imageProps(image: SanityImage, options: ImagePropsOptions = {}): ImageProps {
	const {
		aspectRatio: overrideAspectRatio,
		sizes: sizesOverride,
		artDirection,
		includeLqip = false,
		fallbackWidth = 1200,
		widths = DEFAULT_WIDTHS,
		maxWidth,
		fit = 'crop',
		crop = 'focalpoint',
		format = 'auto',
		quality = 80,
		blur,
		sharpen,
		flip,
	} = options;

	if (!image?.asset) {
		throw new Error('imageProps: image.asset is required');
	}

	// ── Dimensions ──────────────────────────────────────────────────────────────
	const nativeDimensions = image.asset.metadata?.dimensions;
	const nativeWidth = nativeDimensions?.width ?? fallbackWidth;
	const nativeAspectRatio = nativeDimensions?.aspectRatio ?? 16 / 9;
	const finalAspectRatio = overrideAspectRatio ?? nativeAspectRatio;

	// Use the natural width as the canonical output size for width/height attrs
	const outputWidth = Math.min(nativeWidth, maxWidth ?? nativeWidth);
	const outputHeight = Math.round(outputWidth / finalAspectRatio);

	// ── srcSet / sizes ───────────────────────────────────────────────────────────
	let srcSet: string;
	let src: string;
	let computedSizes: string | undefined = sizesOverride;

	if (artDirection && artDirection.length > 0) {
		// Build a unified srcSet covering all art-direction widths
		const allWidths = [
			...new Set([...artDirection.map((bp) => bp.width), ...widths.filter((w) => w <= outputWidth)]),
		].sort((a, b) => a - b);

		const entries = allWidths.map((w) => {
			// Resolve the aspect ratio for this width from art-direction breakpoints
			const matchingBp = artDirection.find((bp) => bp.width === w);
			const bpAspectRatio = matchingBp?.aspectRatio ?? finalAspectRatio;

			const url = imageUrl(image, {
				width: w,
				aspectRatio: bpAspectRatio,
				fit,
				crop,
				format,
				quality,
				blur,
				sharpen,
				flip,
			});
			return `${url} ${w}w`;
		});

		srcSet = entries.join(', ');
		src = imageUrl(image, {
			width: allWidths[0],
			aspectRatio: artDirection[0]?.aspectRatio ?? finalAspectRatio,
			fit,
			crop,
			format,
			quality,
		});

		// Auto-generate sizes from art-direction breakpoints if not supplied
		if (!computedSizes) {
			const sizeEntries = artDirection.map((bp, i) => {
				const isLast = i === artDirection.length - 1;
				return isLast ? `${bp.width}px` : `${bp.media} ${bp.width}px`;
			});
			computedSizes = sizeEntries.join(', ');
		}
	} else {
		const result = imageSrcSet(image, {
			widths,
			maxWidth,
			aspectRatio: finalAspectRatio,
			fit,
			crop,
			format,
			quality,
			blur,
			sharpen,
			flip,
		});
		srcSet = result.srcSet;
		src = result.src;
	}

	// ── LQIP ────────────────────────────────────────────────────────────────────
	const blurDataURL = includeLqip && image.asset.metadata?.lqip ? image.asset.metadata.lqip : undefined;

	// ── Dominant Colour ──────────────────────────────────────────────────────────
	const dominantColor = image.asset.metadata?.palette?.dominant?.background ?? undefined;

	return {
		src,
		srcSet,
		...(computedSizes ? { sizes: computedSizes } : {}),
		width: outputWidth,
		height: outputHeight,
		alt: image.alt ?? '',
		...(blurDataURL ? { blurDataURL } : {}),
		...(dominantColor ? { dominantColor } : {}),
		aspectRatio: finalAspectRatio,
	};
}

// ─── imageOgUrl ───────────────────────────────────────────────────────────────

/**
 * Returns a single high-quality URL for use in `og:image` meta tags.
 * OG images must be:
 *  - JPEG format (most crawlers require it)
 *  - Exactly 1200 × 630 px (1.91:1 ratio)
 *  - No animated content
 */
export function imageOgUrl(image: SanityImage | SanityImageSource): string {
	return urlFor(image).width(1200).height(630).fit('crop').crop('focalpoint').format('jpg').quality(85).url();
}

// ─── imageLqipUrl ─────────────────────────────────────────────────────────────

/**
 * Generates a tiny (20 px wide) blurred image URL that can be used as an
 * inline `blurDataURL` fallback when the stored LQIP is unavailable.
 *
 * This is a CDN-generated LQIP — prefer the stored `asset.metadata.lqip`
 * from your GROQ query whenever possible, as it avoids an extra network round-trip.
 */
export function imageLqipUrl(image: SanityImage | SanityImageSource): string {
	return urlFor(image).width(20).quality(30).blur(10).auto('format').url();
}

// ─── imageThumbUrl ────────────────────────────────────────────────────────────

/**
 * Returns a cropped square thumbnail URL.
 * Useful for avatars, card thumbnails, and media grids.
 *
 * @param size  Output size in px (width = height). Defaults to 200.
 * @param quality  JPEG quality. Defaults to 70.
 */
export function imageThumbUrl(image: SanityImage | SanityImageSource, size = 200, quality = 70): string {
	return urlFor(image).width(size).height(size).fit('crop').crop('focalpoint').auto('format').quality(quality).url();
}

// ─── Convenience re-export ────────────────────────────────────────────────────

export default {
	/** Raw URL builder for low-level control */
	builder: urlFor,
	/** Single optimised URL */
	url: imageUrl,
	/** Responsive srcSet string */
	srcSet: imageSrcSet,
	/** Complete `<img>` props object */
	props: imageProps,
	/** 1200×630 Open Graph JPEG */
	ogUrl: imageOgUrl,
	/** Tiny blurred LQIP fallback URL */
	lqipUrl: imageLqipUrl,
	/** Cropped square thumbnail */
	thumbUrl: imageThumbUrl,
};
