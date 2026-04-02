import { imageFragment } from './image';

export const seo = `
    title,
    description,
    ogImage{
        ${imageFragment}
    },
`;
