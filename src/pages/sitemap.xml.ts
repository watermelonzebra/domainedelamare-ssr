import { getPostSlugs } from '@/sanity/queries/posts';
import type { APIRoute } from 'astro';

const baseUrl = import.meta.env.SITE;

export const GET: APIRoute = async () => {
	const projectSlugs = await getPostSlugs();

	const sitemap = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static pages -->
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/projects</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Dynamic project pages -->
  ${projectSlugs
		.map(
			(slug) => `  <url>
    <loc>${baseUrl}/projects/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
		)
		.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
		},
	});
};
