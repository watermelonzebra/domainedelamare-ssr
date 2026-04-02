import { defineQuery } from 'groq';
import { seo } from '../fragments/seo';

export const SITE_SETTINGS_QUERY = defineQuery(`
    *[_type == "siteSettings"][0] {
        siteName, 
        siteDescription,
        seo{
            ${seo}
        },
    }
`);
