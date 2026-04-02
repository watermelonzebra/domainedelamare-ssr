/**
 * src/sanity/fragments/section.ts
 * Reusable GROQ section fragment.
 * Always include metadata.lqip for low-quality image placeholders.
 */

import { imageFragment } from "./image";
export const sectionFragment = /* groq */ `
  title,
  body,
  contentImage {
    ${imageFragment}
  }
`;
