import { defineQuery } from 'groq';
import { imageFragment } from '../fragments/image';

// ── Query Definitions ──────────────────────────────────────

/**
 * All published posts — list view (summary fields only)
 * Used on /blog index page.
 */
export const POSTS_SUMMARY_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)]
  |  order(ordering asc, publishedAt) {
    _id,
    _createdAt,
    publishedAt,
    title,
    slug,
    price,
    location {
      street,
      number,
      postalCode,
      city,
      country
    },
    features {
      bedrooms,
      bathrooms,
      landArea
    },
    contentImage {
      ${imageFragment}
    },
    seo
  }
`);

/**
 * Single post by slug — detail view (full body)
 * Used on /post/[postSlug] page.
 */
export const POST_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    _createdAt,
    publishedAt,
    title,
    slug,
    price,
    location {
      street,
      number,
      postalCode,
      city,
      country
    },
    features {
      bedrooms,
      bathrooms,
      garage,
      livableArea,
      landArea
    },
    contentImage {
      ${imageFragment}
    },
    "imageGallery": imageGallery[]{
      ${imageFragment}
    },
    "floorplan": floorplan.asset->,
    "category": *[_id == ^.category._ref][0]{
      _id,
      title,
      "slug": slug.current
    },
    body,
    seo
  }
`);

/**
 * All post slugs — used in getStaticPaths
 */
export const POST_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`);