import { defineQuery } from 'groq';
import { sectionFragment } from '../fragments/section';

export const PAGE_CONTENT_QUERY = defineQuery(`
        *[_type == "pageContent"][0] {
        id,
        _createdAt,
        publishedAt,
        socialMedia,
        newsletter{
            ${sectionFragment}
        },
        region{
            ${sectionFragment}
        },
        contactData
    }
`);

export const PAGE_CONTENT_SOCIALS_QUERY = defineQuery(`
        *[_type == "pageContent"][0] {
        id,
        _createdAt,
        publishedAt,
        socialMedia,
    }
`);

export const PAGE_CONTENT_NEWSLETTER_QUERY = defineQuery(`
        *[_type == "pageContent"][0] {
        id,
        _createdAt,
        publishedAt,
        newsletter{
            ${sectionFragment}
        },
    }
`);
export const PAGE_CONTENT_REGION_QUERY = defineQuery(`
        *[_type == "pageContent"][0] {
        id,
        _createdAt,
        publishedAt,
        region{
            ${sectionFragment}
        },
    }
`);
export const PAGE_CONTENT_CONTACT_QUERY = defineQuery(`
        *[_type == "pageContent"][0] {
        id,
        _createdAt,
        publishedAt,
        contactData
    }
`);
