/**
 * src/sanity/fragments/image.ts
 * Reusable GROQ image fragment.
 * Always include metadata.lqip for low-quality image placeholders.
 */
export const imageFragment = /* groq */ `
  asset->{
    _id,
    url,
    metadata {
      lqip,
      dimensions { width, height, aspectRatio }
    }
  },
  alt,
  caption,
  hotspot,
  crop
`;
