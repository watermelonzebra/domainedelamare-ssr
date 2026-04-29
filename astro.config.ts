import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import vercel from '@astrojs/vercel';
import node from "@astrojs/node"; 

import compressor from 'astro-compressor';

let adapter = vercel({
		webAnalytics: {
			enabled: true,
		},
	}); 

if (process.argv[3] === "--node" || process.argv[4] === "--node") { 
	adapter = node({ mode: "standalone" }); 
}

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

	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'hover',
	},
	experimental: {
		clientPrerender: true,
	},

	// Static output — switch to 'hybrid' if you embed Sanity Studio
	output: 'server', // or "server"

	server: {
		headers: {
			// Prevents any site from framing this site
			// 'X-Frame-Options': 'DENY',

			// OR: Allows only your own site to frame it
			'X-Frame-Options': 'SAMEORIGIN',

			// Whitelists the sources allowed to load scripts, styles and frames — the strongest defense against XSS.
			'Content-Security-Policy-Report-Only': `default-src 'self'; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; font-src 'self' https://cdn.jsdelivr.net https://fonts.gstatic.com; img-src 'self' data: https://cdn.sanity.io; script-src 'self' 'unsafe-inline' https://cdn.vercel-insights.com https://*.sanity.io; connect-src 'self' https://*.vercel-insights.com https://*.sanity.io wss://*.sanity.io;`,

			// Prevents browsers from MIME-sniffing a response away from the declared Content-Type.
			'X-Content-Type-Options': 'nosniff',

			'Referrer-Policy': 'strict-origin-when-cross-origin',

			'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
		},
	},

	build: {
		// Inline small CSS, external large — reduces render-blocking requests
		inlineStylesheets: 'auto',
	},

	image: {
		// Allow Sanity CDN images to be optimised via <Image>
		domains: ['cdn.sanity.io'],
	},

	adapter,

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
		}), // Auto-generates /sitemap-index.xml
		react(),
		robotsTxt({
			sitemap: true,
		}),
		sitemap({
			customSitemaps: [PUBLIC_WEBSITE_URL +'/sitemap.xml'],
			customPages: [
				PUBLIC_WEBSITE_URL + '/llms.txt',
				PUBLIC_WEBSITE_URL + '/llms-small.txt',
				PUBLIC_WEBSITE_URL + '/llms-full.txt',
			],
		}),
		compressor(),
	],

	vite: {
		define: {
			'process.env.SECRET_MAIL_API_KEY': JSON.stringify(process.env.SECRET_MAIL_API_KEY),
			'process.env.SECRET_MAIL_API_URL': JSON.stringify(process.env.SECRET_MAIL_API_URL),
		},
	},
});
