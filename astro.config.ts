import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

import vercel from '@astrojs/vercel';

// Load all env vars (public + private) for config-time use
const {
    PUBLIC_SANITY_PROJECT_ID,
    PUBLIC_SANITY_DATASET,
    PUBLIC_WEBSITE_URL,
    PUBLIC_SANITY_STUDIO_URL,
    SECRET_SANITY_READ_TOKEN,
} = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
    // Site URL required for sitemap and canonical URLs
    site: PUBLIC_WEBSITE_URL,

    // Static output — switch to 'hybrid' if you embed Sanity Studio
    output: 'server', // or "server"

    build: {
        // Inline small CSS, external large — reduces render-blocking requests
        inlineStylesheets: 'auto',
    },

    image: {
        // Allow Sanity CDN images to be optimised via <Image>
        domains: ['cdn.sanity.io'],
    },

    adapter: vercel({
		webAnalytics: {
      		enabled: true,
    	},
	}),

    integrations: [
        sanity({
            projectId: PUBLIC_SANITY_PROJECT_ID,
            dataset: PUBLIC_SANITY_DATASET ?? 'production',
            // useCdn: false for static builds ensures fresh content at build time
            useCdn: false,
            apiVersion: '2026-01-01',
            // Uncomment to embed Studio at /admin
            // studioBasePath: '/admin',
            token: SECRET_SANITY_READ_TOKEN,
            stega: {
                enabled: true,
                studioUrl: PUBLIC_SANITY_STUDIO_URL,
            },
        }),

        // Required for astro-portabletext and any React islands
        react(),

        // Auto-generates /sitemap-index.xml
        sitemap(),
    ],
});